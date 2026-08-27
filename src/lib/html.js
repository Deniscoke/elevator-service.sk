/**
 * HTML helpery — základ celého renderovania.
 *
 * Filozofia: žiadny template engine. Stránka je funkcia, ktorá vracia string.
 * Escapovanie je explicitné, aby bolo v kóde vidieť, kde vstupujú dáta.
 */

/** Escapovanie textu do HTML. */
export function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Je hodnota reálne vyplnená?
 * Toto je najdôležitejšia funkcia projektu — rozhoduje, či sa komponent
 * vôbec vykreslí. null / undefined / '' / [] / {} = údaj nemáme.
 */
export function isSet(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  if (typeof value === 'number') return Number.isFinite(value);
  return Boolean(value);
}

/** Vykresli obsah len ak je podmienka splnená. Inak nevráť nič — ani prázdny obal. */
export function when(condition, render) {
  return condition ? (typeof render === 'function' ? render() : render) : '';
}

/** Spojenie zoznamu do HTML bez oddeľovača. */
export function map(list, fn) {
  return (list || []).map(fn).join('');
}

/** Atribúty z objektu; hodnoty null/false/undefined sa vynechajú. */
export function attrs(obj) {
  return Object.entries(obj || {})
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('');
}

/** Telefónne číslo → hodnota pre tel: odkaz (bez medzier a zátvoriek). */
export function telHref(phone) {
  if (!isSet(phone)) return null;
  return 'tel:' + String(phone).replace(/[^\d+]/g, '');
}

/** Absolútna URL pre canonical, OG a sitemap. */
export function absoluteUrl(siteUrl, path) {
  const base = String(siteUrl).replace(/\/+$/, '');
  const rel = path === '/' ? '/' : '/' + String(path).replace(/^\/+|\/+$/g, '') + '/';
  return base + (rel === '/' ? '/' : rel);
}

/** Skrátenie meta description na bezpečnú dĺžku bez useknutého slova. */
export function clampDescription(text, max = 158) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\-–—]$/, '') + '…';
}

/** JSON-LD blok. Vráti prázdny string, ak nie je čo vypísať. */
export function jsonLd(data) {
  if (!data) return '';
  const list = Array.isArray(data) ? data.filter(Boolean) : [data];
  if (list.length === 0) return '';
  return list
    .map(
      (item) =>
        `<script type="application/ld+json">${JSON.stringify(item, null, 0).replace(
          /</g,
          '\\u003c'
        )}</script>`
    )
    .join('\n');
}

/**
 * Odstráni z objektu všetky prázdne vetvy.
 * Používa sa pred zápisom JSON-LD, aby schéma neobsahovala prázdne polia
 * ani null hodnoty — teda ani náznak vymysleného údaja.
 */
export function pruneEmpty(obj) {
  if (Array.isArray(obj)) {
    const arr = obj.map(pruneEmpty).filter((v) => isSet(v) || typeof v === 'number');
    return arr.length ? arr : undefined;
  }
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const pruned = pruneEmpty(v);
      if (isSet(pruned) || typeof pruned === 'number' || pruned === true) out[k] = pruned;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return obj;
}

/** Slovenské skloňovanie počtu: 1 výťah / 2 výťahy / 5 výťahov */
export function plural(n, one, few, many) {
  const abs = Math.abs(n);
  if (abs === 1) return one;
  if (abs >= 2 && abs <= 4) return few;
  return many;
}
