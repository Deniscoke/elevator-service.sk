/**
 * SEO vrstva — meta tagy, OpenGraph a structured data.
 *
 * Kľúčové pravidlo: schéma nesmie obsahovať vymyslený údaj.
 * Všetko ide cez pruneEmpty(), takže z JSON-LD vypadne každá vetva,
 * ktorá by inak bola null, prázdna alebo len naoko vyplnená.
 */

import { esc, isSet, absoluteUrl, clampDescription, jsonLd, pruneEmpty } from './html.js';

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

export function renderHead({ company, title, description, path, noindex = false, extraHead = '' }) {
  const canonical = absoluteUrl(company.siteUrl, path);
  const desc = clampDescription(description);
  const ogImage = isSet(company.brand.ogImage)
    ? absoluteUrl(company.siteUrl, '/').replace(/\/$/, '') + company.brand.ogImage
    : null;

  return `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
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

  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="mask-icon" href="/assets/favicon.svg" color="#0b0f14">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#0b0f14">

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
    areaServed: {
      '@type': 'AdministrativeArea',
      name: company.address.region,
    },
  });
}

/** PostalAddress — len ak máme ulicu aj PSČ. Neúplná adresa sa nevypisuje. */
function addressSchema(company) {
  const a = company.address;
  if (!isSet(a.street) || !isSet(a.postalCode)) return undefined;
  return {
    '@type': 'PostalAddress',
    streetAddress: a.street,
    addressLocality: a.city,
    postalCode: a.postalCode,
    addressRegion: a.region,
    addressCountry: a.countryCode,
  };
}

/**
 * LocalBusiness — len keď máme adresu.
 * Bez adresy by šlo o prázdnu deklaráciu, ktorá SEO nepomôže a je nepravdivá.
 */
export function localBusinessSchema(company) {
  const address = addressSchema(company);
  if (!address) return null;
  const base = String(company.siteUrl).replace(/\/+$/, '');

  return pruneEmpty({
    '@type': 'ProfessionalService',
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
    areaServed: { '@type': 'AdministrativeArea', name: company.address.region },
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
    areaServed: {
      '@type': 'AdministrativeArea',
      name: company.address.region,
    },
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

/** FAQPage — len ak stránka naozaj obsahuje viditeľné otázky. */
export function faqSchema(items) {
  if (!isSet(items)) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

/** Zabalenie do jedného @graph — čistejšie než 5 samostatných blokov. */
export function renderSchemas(company, list) {
  const nodes = list.filter(Boolean);
  if (!nodes.length) return '';
  return jsonLd({ '@context': 'https://schema.org', '@graph': nodes });
}
