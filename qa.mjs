/**
 * Jednorazový QA skript. Prejde vygenerované HTML a skontroluje veci,
 * ktoré sa dajú overiť staticky — SEO, odkazy, obrázky, zvyšky po redizajne.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const pages = [];
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name.endsWith('.html')) pages.push(f);
  }
})(DIST);

const issues = [];
const DEAD = ['floors__', 'emergency__stripe', 'eyebrow--invert', 'eyebrow--danger',
  'nav__panel-desc', 'shaft__', 'preview-warning'];

for (const f of pages) {
  const html = readFileSync(f, 'utf8');
  const rel = f.split(path.sep).join("/");

  if ((html.match(/<h1[\s>]/g) || []).length !== 1) issues.push(`${rel}: počet H1 != 1`);
  if (!/rel="canonical"/.test(html)) issues.push(`${rel}: chýba canonical`);
  if (!/name="description"/.test(html)) issues.push(`${rel}: chýba description`);
  if (!/application\/ld\+json/.test(html) && !rel.includes('404')) issues.push(`${rel}: chýba JSON-LD`);
  if (!/<main id="obsah">/.test(html)) issues.push(`${rel}: chýba main`);

  for (const d of DEAD) if (html.includes(d)) issues.push(`${rel}: zvyšok po redizajne "${d}"`);

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt=/.test(tag)) issues.push(`${rel}: <img> bez alt`);
    if (!/\swidth=/.test(tag) || !/\sheight=/.test(tag)) issues.push(`${rel}: <img> bez width/height`);
  }

  /* Cesty, ktoré obsluhuje hostingová platforma, nie náš build — v dist/
     preto neexistujú a kontrola odkazov ich musí obísť.
       /_vercel/insights/  Vercel Web Analytics (bezcookie meranie)
       /api/               serverless funkcie */
  const PLATFORM_PATHS = [/^\/_vercel\//, /^\/api\//];

  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const p = m[1];
    if (p === '/') continue;
    if (PLATFORM_PATHS.some((re) => re.test(p))) continue;
    const asDir = path.join(DIST, p, 'index.html');
    const asFile = path.join(DIST, p);
    if (!existsSync(asDir) && !existsSync(asFile)) issues.push(`${rel}: nefunkčný odkaz ${p}`);
  }
}

const cssFile = readdirSync(path.join(DIST, 'css')).find((f) => f.endsWith('.css'));
const css = readFileSync(path.join(DIST, 'css', cssFile), 'utf8');
const defined = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const used = new Set([...css.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));
for (const v of used) {
  if (!defined.has(v) && !['--sticky-bar-h', '--reveal-delay', '--lift-progress', '--btn-bg', '--btn-fg', '--btn-border'].includes(v))
    issues.push(`CSS: nedefinovaný token ${v}`);
}

console.log(`Stránok: ${pages.length}`);
console.log(issues.length ? '\nNÁLEZY:\n' + issues.map((i) => ' · ' + i).join('\n') : '\nBez nálezov.');
