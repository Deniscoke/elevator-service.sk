/**
 * Ikony — inline SVG, vlastná kresba, žiadna externá knižnica.
 *
 * Prečo inline a nie sprite/ikonfont:
 * - žiadny ďalší HTTP request a žiadny FOUC
 * - ikona sa dá farbiť cez currentColor
 * - na stránke sú maximálne 2–3 ikony, takže duplicita nič nestojí
 *
 * Štýl: geometrický, 24×24, stroke 1.5, bez výplní — technický, nie „app store".
 */

const wrap = (paths, { size = 24, stroke = 1.5 } = {}) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
  `stroke="currentColor" stroke-width="${stroke}" stroke-linecap="square" ` +
  `stroke-linejoin="miter" aria-hidden="true" focusable="false">${paths}</svg>`;

export const icons = {
  /** Servis — ozubené koleso zjednodušené do technického tvaru */
  gear: () =>
    wrap(
      '<path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/>' +
        '<path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3"/>'
    ),

  /** Opravy — kľúč */
  wrench: () =>
    wrap(
      '<path d="M15.5 3.2a5.3 5.3 0 0 0-4.9 7.4L3.3 17.9a1.6 1.6 0 0 0 0 2.3l.5.5a1.6 1.6 0 0 0 2.3 0l7.3-7.3a5.3 5.3 0 0 0 6.7-6.8l-2.8 2.8-2.7-.7-.7-2.7 2.8-2.8Z"/>'
    ),

  /** Prehliadky — doska so zoznamom a odškrtnutím */
  clipboard: () =>
    wrap(
      '<path d="M9 3.5h6v2.6H9z"/>' +
        '<path d="M15 4.8h3.2v15.7H5.8V4.8H9"/>' +
        '<path d="m8.8 12.6 2 2 4.4-4.4"/>'
    ),

  /** Modernizácia — šípka nahor v šachte */
  upgrade: () =>
    wrap(
      '<path d="M4.5 20.5V6.2M19.5 20.5V6.2M4.5 20.5h15"/>' +
        '<path d="M12 17.5V4.2"/>' +
        '<path d="m8.2 8 3.8-3.8L15.8 8"/>'
    ),

  /** Havária — výstražný trojuholník */
  alert: () =>
    wrap(
      '<path d="M12 3.6 21.4 20H2.6L12 3.6Z"/>' +
        '<path d="M12 9.5v4.4"/><path d="M12 16.6h.01"/>'
    ),

  /** Telefón */
  phone: () =>
    wrap(
      '<path d="M7.6 3.5H4.4c-.6 0-1 .5-.9 1.1.5 4.2 2.4 8 5.3 10.9 2.9 2.9 6.7 4.8 10.9 5.3.6.1 1.1-.3 1.1-.9v-3.2c0-.5-.3-.9-.8-1l-3-.7c-.4-.1-.9.1-1.1.4l-1.2 1.6a13.6 13.6 0 0 1-5.7-5.7l1.6-1.2c.4-.3.5-.7.4-1.1l-.7-3c-.1-.5-.5-.8-1-.8Z"/>'
    ),

  /** E-mail */
  mail: () =>
    wrap('<path d="M2.8 5.5h18.4v13H2.8z"/><path d="m2.8 6.4 9.2 6.6 9.2-6.6"/>'),

  /** Poloha */
  pin: () =>
    wrap(
      '<path d="M12 21.4s7-6 7-11.4a7 7 0 1 0-14 0c0 5.4 7 11.4 7 11.4Z"/>' +
        '<path d="M12 12.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z"/>'
    ),

  /** Šípka doprava — v CTA a kartách */
  arrow: () => wrap('<path d="M4 12h15"/><path d="m13 6 6 6-6 6"/>'),

  /** Dokument */
  doc: () =>
    wrap('<path d="M13.4 3.5H6.2v17h11.6V7.9l-4.4-4.4Z"/><path d="M13.4 3.5v4.4h4.4"/>'),

  /** Hodiny */
  clock: () =>
    wrap('<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M12 7v5.2l3.4 2"/>'),

  /** Štít — bezpečnosť a oprávnenia */
  shield: () =>
    wrap('<path d="M12 3 4.5 6v6c0 4.4 3.1 8.3 7.5 9.4 4.4-1.1 7.5-5 7.5-9.4V6L12 3Z"/>'),

  /** Ľudia — kariéra */
  people: () =>
    wrap(
      '<path d="M9 11.5a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z"/>' +
        '<path d="M2.6 20.3v-1.1a5.5 5.5 0 0 1 5.5-5.5h1.8a5.5 5.5 0 0 1 5.5 5.5v1.1"/>' +
        '<path d="M16.4 5a3.4 3.4 0 0 1 0 6.6"/><path d="M17.6 13.8a5.5 5.5 0 0 1 3.8 5.2v1.3"/>'
    ),
};

/** Bezpečné vykreslenie ikony podľa názvu. Neznámy názov = nič, nie chyba. */
export function icon(name, options) {
  const fn = icons[name];
  return fn ? fn(options) : '';
}
