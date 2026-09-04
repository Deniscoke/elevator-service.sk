/**
 * SEO vrstva — meta tagy, OpenGraph a structured data.
 *
 * Kľúčové pravidlo: schéma nesmie obsahovať vymyslený údaj.
 * Všetko ide cez pruneEmpty(), takže z JSON-LD vypadne každá vetva,
 * ktorá by inak bola null, prázdna alebo len naoko vyplnená.
 */

import { esc, isSet, absoluteUrl, clampDescription, jsonLd, pruneEmpty } from './html.js';
import { serviceArea } from '../../data/locations.js';

const ORG_ID = '#organization';
const SITE_ID = '#website';

/* Stabilné @id pre prepájanie entít v grafe. */
function orgId(siteUrl) {
  return `${String(siteUrl).replace(/\/+$/, '')}/${ORG_ID}`;
}
function siteId(siteUrl) {
  return `${String(siteUrl).replace(/\/+$/, '')}/${SITE_ID}`;
}

/* ------------------------------------------------------------------ */
/*  <head>                                                             */
/* ------------------------------------------------------------------ */

/**
 * Overenie pre Google Search Console a analytika.
 *
 * Kým nie sú v data/company.js reálne hodnoty, nevloží sa nič — žiadne
 * fake ID, žiadny mŕtvy skript. Odporúčaná je bezcookie analytika,
 * ktorá nevyžaduje súhlas ani cookie lištu.
 */
function renderIntegrations(company) {
  const i = (company.integrations || {});
  const a = i.analytics || {};
  const out = [];

  if (isSet(i.searchConsoleVerification)) {
    out.push(`<meta name="google-site-verification" content="${esc(i.searchConsoleVerification)}">`);
  }

  /* Vercel Web Analytics nepotrebuje žiadne ID — meranie beží na vlastnej
     doméne cez /_vercel/insights/. Skript sa načíta len vtedy, keď je
     provider v dátach; zapnutie merania sa navyše robí v projekte na
     Verceli, takže bez oboch krokov sa nezbiera nič. */
  if (a.provider === 'vercel') {
    out.push('<script defer src="/_vercel/insights/script.js"></script>');
  } else if (isSet(a.provider) && isSet(a.id)) {
    if (a.provider === 'plausible') {
      out.push(
        `<script defer data-domain="${esc(a.id)}" src="https://plausible.io/js/script.js"></script>`
      );
    } else if (a.provider === 'umami') {
      const src = isSet(a.scriptUrl) ? a.scriptUrl : 'https://cloud.umami.is/script.js';
      out.push(`<script defer data-website-id="${esc(a.id)}" src="${esc(src)}"></script>`);
    } else if (a.provider === 'ga4') {
      // GA4 ukladá cookies — bez súhlasu sa nesmie spúšťať.
      // Preto sa načíta až po udelení súhlasu, ktorý nie je súčasťou
      // tohto balíka. Zámerne sa tu nevkladá nič.
      out.push('<!-- GA4 vyžaduje súhlas; consent vrstva nie je súčasťou tohto balíka -->');
    }
  }

  return out.length ? '\n  ' + out.join('\n  ') : '';
}

export function renderHead({ company, title, description, path, noindex = false, extraHead = '' }) {
  /* absoluteUrl pridáva koncovú lomku, čo pri názve súboru vytvorí
     neplatnú URL (/404.html/). Súborové cesty preto skladáme priamo. */
  const canonical = /\.[a-z0-9]+$/i.test(path)
    ? String(company.siteUrl).replace(/\/+$/, '') + path
    : absoluteUrl(company.siteUrl, path);
  const desc = clampDescription(description);
  const ogImage = isSet(company.brand.ogImage)
    ? absoluteUrl(company.siteUrl, '/').replace(/\/$/, '') + company.brand.ogImage
    : null;

  return `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${esc(canonical)}">
  ${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(company.legalName)}">
  <meta property="og:locale" content="${esc(company.locale)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(canonical)}">
  ${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/assets/favicon-32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="/assets/icon-192.png" sizes="192x192" type="image/png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#fbfaf8">

${renderIntegrations(company)}

  <link rel="preload" href="/assets/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/archivo-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/css/main.css" as="style">
  <link rel="stylesheet" href="/css/main.css">
${extraHead}`.trim();
}

/* ------------------------------------------------------------------ */
/*  JSON-LD                                                            */
/* ------------------------------------------------------------------ */

/** Organization — vždy. Obsahuje len to, čo naozaj vieme. */
export function organizationSchema(company) {
  const base = String(company.siteUrl).replace(/\/+$/, '');
  const sameAs = Object.values(company.profiles || {}).filter(isSet);

  return pruneEmpty({
    '@type': 'Organization',
    '@id': orgId(company.siteUrl),
    name: company.legalName,
    alternateName: company.name,
    url: base + '/',
    description: company.claim,
    logo: isSet(company.brand.logo) ? base + company.brand.logo : undefined,
    telephone: company.contact.phone || undefined,
    email: company.contact.email || undefined,
    vatID: company.legal.icDph || undefined,
    taxID: company.legal.dic || undefined,
    identifier: company.legal.ico || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    address: addressSchema(company),
    areaServed: areaServedSchema(company),
    contactPoint: emergencyContactPoint(company),
  });
}

/**
 * Havarijná linka. Nonstop dostupnosť aj číslo sú potvrdené klientom
 * a sú viditeľne na webe, takže smú byť aj v štruktúrovaných dátach.
 * Keď sa v dátach vypnú, uzol zmizne.
 */
function emergencyContactPoint(company) {
  const e = company.emergency;
  if (!e || !e.enabled || !isSet(company.contact.emergencyPhone)) return undefined;
  return {
    '@type': 'ContactPoint',
    contactType: 'emergency',
    telephone: company.contact.emergencyPhone,
    availableLanguage: 'sk',
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  };
}

/**
 * Obsluhovaná oblasť.
 *
 * Musí zodpovedať tomu, čo je napísané na stránke. Web hovorí o okolí
 * Banskej Bystrice v danom polomere — deklarovať celý kraj by bolo
 * širšie tvrdenie, než aké firma robí.
 */
function areaServedSchema(company) {
  const label =
    serviceArea.confirmed && isSet(serviceArea.radiusKm)
      ? serviceArea.confirmedLabelTemplate.replace('{radius}', String(serviceArea.radiusKm))
      : serviceArea.provisionalLabel;
  return { '@type': 'Place', name: label };
}

/**
 * PostalAddress.
 *
 * Ulicu ani PSČ zatiaľ nemáme, ale mesto a kraj áno a sú aj viditeľne na
 * webe — vypustiť adresu úplne by znamenalo zamlčať pravdivý údaj.
 * Vypisuje sa preto toľko, koľko naozaj vieme; chýbajúce polia sa
 * nedopĺňajú. Po doplnení ulice a PSČ sa schéma rozšíri sama.
 */
function addressSchema(company) {
  const a = company.address;
  if (!isSet(a.city)) return undefined;
  return pruneEmpty({
    '@type': 'PostalAddress',
    streetAddress: isSet(a.street) ? a.street : undefined,
    addressLocality: a.city,
    postalCode: isSet(a.postalCode) ? a.postalCode : undefined,
    addressRegion: a.region,
    addressCountry: a.countryCode,
  });
}

/** Má schéma dosť údajov na to, aby dávala zmysel ako prevádzka? */
function hasLocality(company) {
  return isSet(company.address.city);
}

/**
 * LocalBusiness — vykreslí sa, keď vieme aspoň mesto prevádzky.
 * Podtyp HomeAndConstructionBusiness je najbližší tomu, čo firma robí
 * (údržba a technické služby na budovách).
 */
export function localBusinessSchema(company) {
  const address = addressSchema(company);
  if (!address || !hasLocality(company)) return null;
  const base = String(company.siteUrl).replace(/\/+$/, '');

  return pruneEmpty({
    '@type': 'HomeAndConstructionBusiness',
    '@id': base + '/#localbusiness',
    name: company.legalName,
    url: base + '/',
    parentOrganization: { '@id': orgId(company.siteUrl) },
    address,
    telephone: company.contact.phone || undefined,
    email: company.contact.email || undefined,
    geo: isSet(company.address.coordinates)
      ? {
          '@type': 'GeoCoordinates',
          latitude: company.address.coordinates.lat,
          longitude: company.address.coordinates.lng,
        }
      : undefined,
    openingHoursSpecification: isSet(company.openingHours)
      ? company.openingHours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        }))
      : undefined,
    areaServed: areaServedSchema(company),
  });
}

/** WebSite */
export function websiteSchema(company) {
  const base = String(company.siteUrl).replace(/\/+$/, '');
  return {
    '@type': 'WebSite',
    '@id': siteId(company.siteUrl),
    url: base + '/',
    name: company.legalName,
    inLanguage: 'sk-SK',
    publisher: { '@id': orgId(company.siteUrl) },
  };
}

/** Service — na stránke služby. */
export function serviceSchema(company, service) {
  return pruneEmpty({
    '@type': 'Service',
    name: service.schemaName,
    serviceType: service.schemaName,
    description: service.summary,
    url: absoluteUrl(company.siteUrl, service.path),
    provider: { '@id': orgId(company.siteUrl) },
    areaServed: areaServedSchema(company),
  });
}

/** BreadcrumbList */
export function breadcrumbSchema(company, crumbs) {
  if (!isSet(crumbs) || crumbs.length < 2) return null;
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: absoluteUrl(company.siteUrl, c.path),
    })),
  };
}

/* FAQPage schéma tu zámerne NIE JE.
 *
 * Štyri otázky z data/faq.js sa zobrazujú na domovskej stránke aj na
 * príslušnej tematickej stránke. Schéma ich preto opisovala dvakrát,
 * na dvoch URL — tá istá Question ako dve entity. Bola to duplicita
 * v koreni, nie v šablóne.
 *
 * Google FAQ rich results pre bežné komerčné weby od roku 2023 prakticky
 * nezobrazuje, takže značkovanie neprinášalo žiadny úžitok, len povinnosť
 * držať ho v súlade s viditeľným textom. Riešením je odstránenie, nie
 * presúvanie duplicity.
 *
 * Viditeľné FAQ sekcie na stránkach zostávajú nedotknuté.
 * Ak by sa schéma niekedy vracala, musí byť len na JEDNEJ URL pre danú
 * otázku a musí presne zodpovedať viditeľnému textu.
 */

/** Zabalenie do jedného @graph — čistejšie než 5 samostatných blokov. */
export function renderSchemas(company, list) {
  const nodes = list.filter(Boolean);
  if (!nodes.length) return '';
  return jsonLd({ '@context': 'https://schema.org', '@graph': nodes });
}
