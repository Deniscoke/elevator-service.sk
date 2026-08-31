/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — konfigurácia formulárov
 *
 * Formulár je napísaný proti abstrakcii, nie proti konkrétnej službe.
 * Keď sa rozhodne o backende, zmení sa TU jedna hodnota a nikde inde.
 *
 * endpoint: null  → formulár sa vykreslí, validuje sa,
 *                   ale NEPREDSTIERA odoslanie. Používateľ dostane
 *                   jasnú informáciu a alternatívny kontakt (ak existuje).
 *
 * Podporované transporty (implementácia v static/js/form.js):
 *   'json'     — POST application/json na vlastný endpoint / serverless funkciu
 *   'formdata' — POST multipart/form-data (Formspree, Netlify Forms, Basin…)
 *   'mailto'   — núdzový režim, otvorí e-mailového klienta (vyžaduje contact.email)
 */

export const forms = {
  // Rozhodnuté: dopyt ide na vlastnú serverless funkciu na Verceli,
  // ktorá ho odošle e-mailom. Detaily v api/dopyt.js.
  transport: 'json',
  endpoint: '/api/dopyt',

  /** Ochrana proti spamu bez externých služieb a bez CAPTCHA. */
  antispam: {
    honeypot: 'website',   // pole skryté pre ľudí, viditeľné pre boty
    minFillSeconds: 3,     // formulár vyplnený rýchlejšie = pravdepodobne bot
  },

  /**
   * Prílohy — súčasť balíka Rast.
   * Súbory idú v base64 v tele požiadavky. Vercel obmedzuje telo na ~4,5 MB
   * a base64 objem nafúkne o tretinu, preto sú limity zámerne nízke.
   */
  attachments: {
    enabled: true,
    maxFiles: 3,
    maxSizeMb: 2,
    accept: 'image/jpeg,image/png,image/webp,application/pdf',
    hints: [
      'Fotografia výťahu alebo kabíny',
      'Fotografia výrobného štítku zariadenia',
    ],
  },

  /** Kam presmerovať po úspešnom odoslaní (null = potvrdenie priamo na stránke). */
  successRedirect: null,
};

/** Polia dopytového formulára — jediný zdroj pravdy pre UI aj payload. */
export const inquiryFields = [
  { name: 'meno',         label: 'Meno a priezvisko',     type: 'text',     required: true,  autocomplete: 'name' },
  { name: 'firma',        label: 'Firma / SVB / správca', type: 'text',     required: false, autocomplete: 'organization' },
  { name: 'telefon',      label: 'Telefón',               type: 'tel',      required: false, autocomplete: 'tel' },
  { name: 'email',        label: 'E-mail',                type: 'email',    required: false, autocomplete: 'email' },
  { name: 'mesto',        label: 'Mesto alebo obec',      type: 'text',     required: true,  autocomplete: 'address-level2' },
  { name: 'typObjektu',   label: 'Typ objektu',           type: 'select',   required: false },
  { name: 'pocetVytahov', label: 'Počet výťahov',         type: 'number',   required: false, min: 1, max: 500 },
  { name: 'typPoziadavky',label: 'Typ požiadavky',        type: 'select',   required: true },
  { name: 'sprava',       label: 'Popis požiadavky',      type: 'textarea', required: true },
];
