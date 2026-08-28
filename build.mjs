/**
 * build.mjs — generátor statického webu ELEVÁTOR SERVIS
 *
 * Nulové závislosti. Beží na čistom Node 18+.
 * Výstup v dist/ je obyčajné statické HTML/CSS/JS — hostovateľné kdekoľvek.
 *
 * REŽIMY
 *   node build.mjs           náhľadový build (varovania, ale prejde)
 *   node build.mjs --prod    produkčný build (ZLYHÁ, ak chýbajú kritické údaje)
 *   node build.mjs --prod --dry   len kontrola, nič nezapisuje
 *
 * Prečo produkčný build zlyháva:
 * Toto je jediná vec, ktorá spoľahlivo zabráni tomu, aby sa web spustil
 * s nefunkčným formulárom alebo bez povinných firemných údajov.
 * Kontrolný zoznam v hlave sa dá prehliadnuť. Build sa prehliadnuť nedá.
 */

import { mkdir, writeFile, readFile, rm, cp, readdir } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderPage } from './src/lib/layout.js';
import { hidden as hiddenComponents } from './src/lib/components.js';
import { absoluteUrl, isSet } from './src/lib/html.js';

import { company, productionRequirements } from './data/company.js';
import { serviceArea, publishedLocations } from './data/locations.js';
import { forms } from './data/forms.js';

/* ---- stránky (poradie určuje aj poradie v sitemap.xml) ------------ */
import home from './src/pages/home.js';
import servis from './src/pages/servis-vytahov.js';
import opravy from './src/pages/opravy-vytahov.js';
import prehliadky from './src/pages/odborne-prehliadky-a-skusky.js';
import modernizacia from './src/pages/modernizacia-vytahov.js';
import havaria from './src/pages/havarijna-sluzba.js';
import oNas from './src/pages/o-nas.js';
import referencie from './src/pages/referencie.js';
import kariera from './src/pages/kariera.js';
import kontakt from './src/pages/kontakt.js';
import poradna from './src/pages/poradna.js';
import gdpr from './src/pages/ochrana-osobnych-udajov.js';
import notFound from './src/pages/404.js';

const PAGES = [
  home, servis, opravy, prehliadky, modernizacia, havaria,
  oNas, referencie, kariera, kontakt, poradna, gdpr, notFound,
];

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const STYLES = path.join(ROOT, 'src', 'styles');
const STATIC = path.join(ROOT, 'static');

const args = process.argv.slice(2);
const isProd = args.includes('--prod');
const isDry = args.includes('--dry');
// --dev zapne interné upozornenia určené vývojárovi, nie klientovi.
const isDev = args.includes('--dev');

const problems = { errors: [], warnings: [] };
const fail = (m) => problems.errors.push(m);
const warn = (m) => problems.warnings.push(m);

/* ================================================================== */
/*  Kontext pre stránky                                               */
/* ================================================================== */

/**
 * Popis servisnej oblasti.
 * Kým klient nepotvrdí polomer, web hovorí len „Banská Bystrica a okolie".
 * Konkrétny počet kilometrov je tvrdenie — a to sa nevymýšľa.
 */
function buildServiceAreaLabel() {
  if (serviceArea.confirmed && isSet(serviceArea.radiusKm)) {
    return serviceArea.confirmedLabelTemplate.replace('{radius}', String(serviceArea.radiusKm));
  }
  return serviceArea.provisionalLabel;
}

const ctx = {
  company,
  serviceAreaLabel: buildServiceAreaLabel(),
  isProd,
  isDev,
};

/* ================================================================== */
/*  CSS — zreťazenie vrstiev do jedného súboru                        */
/* ================================================================== */

async function buildCss() {
  const files = (await readdir(STYLES)).filter((f) => f.endsWith('.css')).sort();
  const parts = [];

  for (const file of files) {
    const css = await readFile(path.join(STYLES, file), 'utf8');
    parts.push(`/* ===== ${file} ===== */\n${css}`);
  }

  let out = parts.join('\n\n');

  /**
   * V produkcii odstránime komentáre a prebytočné odsadenie.
   * Zámerne nič viac — agresívna minifikácia bez parsera je najrýchlejšia
   * cesta k záhadne rozbitému layoutu. Zvyšok vyrieši gzip na hostingu.
   */
  if (isProd) {
    out = out
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^[ \t]+/gm, '')
      .replace(/\n{2,}/g, '\n')
      .trim();
  }

  /**
   * Do názvu ide hash obsahu.
   *
   * Assety sa servírujú s `Cache-Control: immutable`, čo je sľub, že sa
   * na danej URL už nikdy nezmenia. Na nemennom názve `main.css` by
   * bol ten sľub porušený pri každom deployi a vracajúci sa návštevník
   * by rok videl starý štýl s novým HTML. S hashom v názve zmena
   * obsahu automaticky mení URL.
   */
  const hash = createHash('sha256').update(out).digest('hex').slice(0, 8);
  const name = `main.${hash}.css`;

  if (!isDry) {
    await mkdir(path.join(DIST, 'css'), { recursive: true });
    await writeFile(path.join(DIST, 'css', name), out, 'utf8');
  }
  return { files: files.length, bytes: Buffer.byteLength(out), name, url: `/css/${name}` };
}

/** To isté pre skripty kopírované zo static/. */
async function hashScripts() {
  const map = {};
  for (const file of ['site.js', 'form.js']) {
    const src = path.join(STATIC, 'js', file);
    if (!existsSync(src)) continue;
    const body = await readFile(src, 'utf8');
    const hash = createHash('sha256').update(body).digest('hex').slice(0, 8);
    const name = file.replace(/\.js$/, `.${hash}.js`);
    if (!isDry) {
      await writeFile(path.join(DIST, 'js', name), body, 'utf8');
      await rm(path.join(DIST, 'js', file), { force: true });
    }
    map[`/js/${file}`] = `/js/${name}`;
  }
  return map;
}

/* ================================================================== */
/*  Stránky                                                           */
/* ================================================================== */

async function buildPages() {
  const rendered = [];

  for (const pageFn of PAGES) {
    const page = pageFn(ctx);
    const html = renderPage({
      company,
      serviceAreaLabel: ctx.serviceAreaLabel,
      title: page.title,
      description: page.description,
      path: page.path,
      bodyClass: page.bodyClass,
      crumbs: page.crumbs,
      schemas: page.schemas,
      main: page.main,
      noindex: page.noindex,
      extraHead: page.extraHead || '',
      extraScripts: page.extraScripts || '',
    });

    // 404 ide do koreňa ako súbor, ostatné do adresára s index.html.
    const relative = page.file
      ? page.file
      : page.path === '/'
      ? 'index.html'
      : path.join(page.path.replace(/^\/+|\/+$/g, ''), 'index.html');

    const target = path.join(DIST, relative);

    if (!isDry) {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, html, 'utf8');
    }

    rendered.push({
      path: page.path,
      file: relative.replace(/\\/g, '/'),
      title: page.title,
      description: page.description,
      html,
      inSitemap: page.sitemap !== false && !page.noindex,
      bytes: Buffer.byteLength(html),
    });
  }

  return rendered;
}

/* ================================================================== */
/*  sitemap.xml + robots.txt                                          */
/* ================================================================== */

async function buildSitemap(pages) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => p.inSitemap)
    .map(
      (p) =>
        `  <url>\n    <loc>${absoluteUrl(company.siteUrl, p.path)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
    );

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join('\n') +
    '\n</urlset>\n';

  const robots =
    '# robots.txt — ' +
    company.legalName +
    '\nUser-agent: *\nAllow: /\n\nSitemap: ' +
    absoluteUrl(company.siteUrl, '/').replace(/\/$/, '') +
    '/sitemap.xml\n';

  if (!isDry) {
    await writeFile(path.join(DIST, 'sitemap.xml'), xml, 'utf8');
    await writeFile(path.join(DIST, 'robots.txt'), robots, 'utf8');
  }

  return urls.length;
}

/* ================================================================== */
/*  Kontrola 1 — presakovanie zástupných hodnôt                       */
/* ================================================================== */

/**
 * Toto je poistka proti presne tomu, čoho sa zadanie bojí:
 * aby sa do produkcie nedostal vymyslený alebo dočasný údaj.
 */
const LEAK_PATTERNS = [
  [/lorem\s+ipsum/i, 'lorem ipsum'],
  [/\bTODO\b/, 'TODO'],
  [/\bFIXME\b/, 'FIXME'],
  [/\bJohn\s+Doe\b/i, 'John Doe'],
  [/\bFake\s+Company\b/i, 'Fake Company'],
  [/NEEDS_EXPERT_VERIFICATION/, 'NEEDS_EXPERT_VERIFICATION'],
  [/ČAKÁ NA KLIENTA/, 'interná poznámka „ČAKÁ NA KLIENTA"'],
  [/\bXXX+\b/, 'XXX'],
  [/\bnull\b(?![^<]*<\/script>)/, 'reťazec „null" vo viditeľnom obsahu'],
  [/undefined/, 'reťazec „undefined"'],
];

/**
 * Podmienené kontroly.
 *
 * Tvrdenie „24/7" ani počet výťahov nie sú samy osebe chybou — chybou sú
 * len vtedy, keď za nimi v dátach nestojí potvrdený údaj od klienta.
 * Vzor sa preto do kontroly pridá iba vtedy, keď podklad chýba.
 *
 * Presne toto sa stalo po dodaní dotazníka: klient potvrdil nonstop
 * havarijnú službu aj vyše 300 servisovaných zariadení, takže obe
 * tvrdenia sú odteraz legitímne.
 */
function conditionalLeakPatterns() {
  const extra = [];
  if (!company.emergency.enabled) {
    extra.push([/24\s*\/\s*7/, 'tvrdenie 24/7 bez potvrdeného režimu havarijnej služby']);
  }
  if (!isSet(company.stats.servicedLifts)) {
    extra.push([/\b\d{3,}\s*\+?\s*výťahov/i, 'počet výťahov bez podkladu v dátach']);
  }
  return extra;
}

function checkLeaks(pages) {
  const found = [];
  for (const p of pages) {
    // Kontrolujeme len viditeľný obsah — JSON-LD a komentáre by dali falošné poplachy.
    const visible = p.html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '');

    for (const [re, label] of [...LEAK_PATTERNS, ...conditionalLeakPatterns()]) {
      if (re.test(visible)) found.push({ file: p.file, label });
    }
  }
  return found;
}

/* ================================================================== */
/*  Kontrola 2 — interné odkazy                                       */
/* ================================================================== */

function checkLinks(pages) {
  const known = new Set(pages.map((p) => p.path));
  known.add('/404.html');

  const staticFiles = new Set();
  const walk = (dir, prefix = '') => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, prefix + '/' + entry.name);
      else staticFiles.add(prefix + '/' + entry.name);
    }
  };
  walk(STATIC);
  staticFiles.add('/css/main.css');
  for (const entry of readdirSync(path.join(DIST, 'css'))) staticFiles.add('/css/' + entry);
  if (existsSync(path.join(DIST, 'js')))
    for (const entry of readdirSync(path.join(DIST, 'js'))) staticFiles.add('/js/' + entry);
  staticFiles.add('/sitemap.xml');
  staticFiles.add('/robots.txt');

  const broken = [];
  for (const p of pages) {
    const hrefs = [...p.html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      if (!href.startsWith('/')) continue;              // externé a kotvy neriešime
      const clean = href.split('#')[0].split('?')[0];
      if (clean === '') continue;
      if (known.has(clean) || staticFiles.has(clean)) continue;
      broken.push({ file: p.file, href });
    }
  }
  return broken;
}

/* ================================================================== */
/*  Kontrola 3 — SEO metadáta                                         */
/* ================================================================== */

function checkSeo(pages) {
  const titles = new Map();
  const descriptions = new Map();
  const issues = [];

  for (const p of pages) {
    if (!p.inSitemap) continue;

    if (!p.title) issues.push(`${p.file}: chýba <title>`);
    else if (p.title.length > 65) issues.push(`${p.file}: title má ${p.title.length} znakov (odporúčané ≤ 65)`);

    if (!p.description) issues.push(`${p.file}: chýba meta description`);
    else if (p.description.length > 165)
      issues.push(`${p.file}: description má ${p.description.length} znakov (odporúčané ≤ 160)`);

    if (titles.has(p.title)) issues.push(`${p.file}: duplicitný title s ${titles.get(p.title)}`);
    titles.set(p.title, p.file);

    if (descriptions.has(p.description))
      issues.push(`${p.file}: duplicitná description s ${descriptions.get(p.description)}`);
    descriptions.set(p.description, p.file);

    const h1Count = (p.html.match(/<h1[\s>]/g) || []).length;
    if (h1Count !== 1) issues.push(`${p.file}: počet H1 je ${h1Count} (má byť presne 1)`);
  }

  return issues;
}

/* ================================================================== */
/*  Kontrola 4 — pripravenosť na produkciu                            */
/* ================================================================== */

function checkProductionReadiness() {
  const missing = [];

  for (const [key, value, label] of productionRequirements) {
    if (!isSet(value)) missing.push(`${label} (${key})`);
  }

  const transportOk =
    isSet(forms.transport) && (forms.transport === 'mailto' || isSet(forms.endpoint));
  if (!transportOk) {
    missing.push('Napojenie formulára — data/forms.js → transport + endpoint');
  }

  if (company.siteUrl.includes('elevatorservis.sk') && !process.env.SITE_URL) {
    missing.push('Potvrdená doména — data/company.js → siteUrl alebo premenná SITE_URL');
  }

  if (!isSet(company.brand.logo)) {
    missing.push('Firemné logo — data/company.js → brand.logo');
  }

  if (String(company.brand.ogImage || '').endsWith('.svg')) {
    missing.push('OG obrázok vo formáte PNG/JPG 1200×630 — brand.ogImage');
  }

  return missing;
}

/* ================================================================== */
/*  Build report                                                      */
/* ================================================================== */

async function writeReport({ pages, css, sitemapCount, leaks, broken, seoIssues, notReady }) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

  const lines = [
    '# Build report',
    '',
    `Vygenerované: ${now}`,
    `Režim: ${isProd ? 'PRODUKČNÝ (--prod)' : 'náhľadový'}`,
    `Doména: ${company.siteUrl}`,
    `Servisná oblasť: ${ctx.serviceAreaLabel}${serviceArea.confirmed ? '' : ' (nepotvrdená)'}`,
    '',
    '> Tento súbor generuje `node build.mjs`. Needituj ho ručne.',
    '',
    '## Vygenerované stránky',
    '',
    '| Stránka | Súbor | Veľkosť | V sitemap |',
    '| --- | --- | ---: | :---: |',
    ...pages.map(
      (p) =>
        `| ${p.path} | ${p.file} | ${(p.bytes / 1024).toFixed(1)} kB | ${p.inSitemap ? 'áno' : 'nie'} |`
    ),
    '',
    `CSS: ${css.files} vrstiev → \`css/main.css\` (${(css.bytes / 1024).toFixed(1)} kB)`,
    `Sitemap: ${sitemapCount} URL`,
    '',
    '## Komponenty skryté pre chýbajúce dáta',
    '',
  ];

  if (hiddenComponents.length === 0) {
    lines.push('Žiadne — všetky komponenty mali dostatok dát.', '');
  } else {
    // Rovnaký komponent sa môže skryť na viacerých stránkach.
    const unique = new Map();
    for (const h of hiddenComponents) unique.set(h.component + h.reason, h);
    lines.push('| Komponent | Dôvod |', '| --- | --- |');
    for (const h of unique.values()) lines.push(`| \`${h.component}\` | ${h.reason} |`);
    lines.push('');
  }

  lines.push('## Kontroly', '');
  lines.push(`- Presakovanie zástupných hodnôt: ${leaks.length === 0 ? 'OK' : leaks.length + ' nález(ov)'}`);
  lines.push(`- Interné odkazy: ${broken.length === 0 ? 'OK' : broken.length + ' nefunkčných'}`);
  lines.push(`- SEO metadáta: ${seoIssues.length === 0 ? 'OK' : seoIssues.length + ' upozornení'}`);
  lines.push(`- Pripravenosť na produkciu: ${notReady.length === 0 ? 'OK' : notReady.length + ' chýbajúcich údajov'}`);
  lines.push('');

  if (leaks.length) {
    lines.push('### Presakovanie zástupných hodnôt', '');
    leaks.forEach((l) => lines.push(`- \`${l.file}\` — ${l.label}`));
    lines.push('');
  }
  if (broken.length) {
    lines.push('### Nefunkčné interné odkazy', '');
    broken.forEach((b) => lines.push(`- \`${b.file}\` → \`${b.href}\``));
    lines.push('');
  }
  if (seoIssues.length) {
    lines.push('### SEO upozornenia', '');
    seoIssues.forEach((s) => lines.push(`- ${s}`));
    lines.push('');
  }
  if (notReady.length) {
    lines.push('### Chýba pred spustením webu', '');
    notReady.forEach((n) => lines.push(`- [ ] ${n}`));
    lines.push('', 'Detaily a kontext: [MISSING_DATA.md](./MISSING_DATA.md)', '');
  }

  if (!isDry) {
    await writeFile(path.join(ROOT, 'docs', 'BUILD_REPORT.md'), lines.join('\n'), 'utf8');
  }
}

/* ================================================================== */
/*  Hlavný beh                                                        */
/* ================================================================== */

async function main() {
  const started = Date.now();
  console.log(`\n  ELEVÁTOR SERVIS — build (${isProd ? 'produkčný' : 'náhľadový'}${isDry ? ', dry-run' : ''})\n`);

  if (!isDry) {
    await rm(DIST, { recursive: true, force: true });
    await mkdir(DIST, { recursive: true });
    await cp(STATIC, DIST, { recursive: true });
  }

  const css = await buildCss();
  const scripts = await hashScripts();
  const assetMap = { '/css/main.css': css.url, ...scripts };

  let pages = await buildPages();

  // Prepísanie ciest na hashované názvy. Robí sa až tu, aby stránky
  // nemuseli o hashoch vedieť.
  pages = await Promise.all(
    pages.map(async (p) => {
      let html = p.html;
      for (const [from, to] of Object.entries(assetMap)) html = html.split(from).join(to);
      if (!isDry) await writeFile(path.join(DIST, p.file), html, 'utf8');
      return { ...p, html, bytes: Buffer.byteLength(html) };
    })
  );
  const sitemapCount = await buildSitemap(pages);

  const leaks = checkLeaks(pages);
  const broken = checkLinks(pages);
  const seoIssues = checkSeo(pages);
  const notReady = checkProductionReadiness();

  leaks.forEach((l) => fail(`Zástupná hodnota v ${l.file}: ${l.label}`));
  broken.forEach((b) => fail(`Nefunkčný odkaz v ${b.file}: ${b.href}`));
  seoIssues.forEach((s) => warn(s));
  notReady.forEach((n) => (isProd ? fail(`Chýba pre produkciu: ${n}`) : warn(`Čaká na doplnenie: ${n}`)));

  await writeReport({ pages, css, sitemapCount, leaks, broken, seoIssues, notReady });

  /* ---- výpis ------------------------------------------------------ */
  console.log(`  Stránky      ${pages.length}`);
  console.log(`  CSS          ${css.files} vrstiev → ${css.name} (${(css.bytes / 1024).toFixed(1)} kB)`);
  console.log(`  Sitemap      ${sitemapCount} URL`);
  console.log(`  Skryté bloky ${new Set(hiddenComponents.map((h) => h.component)).size}`);

  if (problems.warnings.length) {
    console.log(`\n  ⚠  Upozornenia (${problems.warnings.length}):`);
    problems.warnings.forEach((w) => console.log(`     · ${w}`));
  }

  if (problems.errors.length) {
    console.log(`\n  ✖  Chyby (${problems.errors.length}):`);
    problems.errors.forEach((e) => console.log(`     · ${e}`));
    console.log('\n  Build neprešiel.\n');
    process.exit(1);
  }

  console.log(`\n  Hotovo za ${Date.now() - started} ms → dist/`);
  if (!isProd) {
    console.log('  Pred spustením webu spusti: npm run build:prod\n');
  } else {
    console.log('');
  }
}

main().catch((err) => {
  console.error('\n  Build zlyhal:\n', err);
  process.exit(1);
});
