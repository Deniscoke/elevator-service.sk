/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — firemné údaje
 * ELEVÁTOR SERVIS, s.r.o.
 *
 * ══════════════════════════════════════════════════════════════════
 *  PRAVIDLO PROJEKTU
 *  null  = údaj zatiaľ nemáme od klienta → komponent sa NEVYKRESLÍ
 *  []    = zoznam je prázdny → sekcia sa NEVYKRESLÍ
 *  false = funkcia je vypnutá → prvok sa NEVYKRESLÍ
 *
 *  Nikdy sem nedopĺňaj odhad, "zatiaľ dajme toto" ani marketingové číslo.
 *  Build v režime --prod odmietne zostaviť web, kým chýbajú kritické údaje.
 *  Zoznam chýbajúcich údajov: docs/MISSING_DATA.md
 * ══════════════════════════════════════════════════════════════════
 */

export const company = {
  /* ---- identita ---------------------------------------------------- */
  name: 'ELEVÁTOR SERVIS',
  legalName: 'ELEVÁTOR SERVIS, s.r.o.',
  claim: 'Servis, opravy a modernizácia výťahov',

  /* ---- web --------------------------------------------------------- */
  // POZOR: finálnu doménu potvrdzuje klient. Prepíše sa cez env SITE_URL.
  siteUrl: process.env.SITE_URL || 'https://www.elevatorservis.sk',
  locale: 'sk_SK',
  lang: 'sk',

  /* ---- kontakt ----------------------------------------------------- */
  contact: {
    phone: null,            // ČAKÁ NA KLIENTA — hlavné telefónne číslo
    phoneNote: null,        // napr. "Po–Pi 7:00–15:30"
    emergencyPhone: null,   // ČAKÁ NA KLIENTA — havarijná linka
    email: null,            // ČAKÁ NA KLIENTA — hlavný e-mail
    emailCareers: null,     // ČAKÁ NA KLIENTA — e-mail pre kariéru
  },

  /* ---- adresa / prevádzka ------------------------------------------ */
  address: {
    street: null,           // ČAKÁ NA KLIENTA
    city: 'Banská Bystrica',
    postalCode: null,       // ČAKÁ NA KLIENTA
    country: 'Slovensko',
    countryCode: 'SK',
    region: 'Banskobystrický kraj',
    mapUrl: null,           // ČAKÁ NA KLIENTA — odkaz na Google Maps
    coordinates: null,      // { lat, lng } — ČAKÁ NA KLIENTA
  },

  /* ---- pracovné hodiny ---------------------------------------------- */
  // Formát pre schema.org: [{ days: ['Mo','Tu'], opens: '07:00', closes: '15:30' }]
  openingHours: null,       // ČAKÁ NA KLIENTA

  /* ---- havarijná služba -------------------------------------------- */
  // enabled sa smie prepnúť na true až po písomnom potvrdení klientom.
  emergency: {
    enabled: false,         // ČAKÁ NA KLIENTA — potvrdenie režimu
    mode: null,             // 'nonstop' | 'rozsirene' | 'pracovne-dni'
    hoursLabel: null,       // napr. "Nonstop, 365 dní v roku"
    responseTimeNote: null, // priemerný čas výjazdu — NEVYPĹŇAŤ bez dát
  },

  /* ---- čísla do trust layeru --------------------------------------- */
  // Každý údaj sa zobrazí len ak nie je null. Žiadne "500+", žiadne "24/7".
  stats: {
    yearsInBusiness: null,  // ČAKÁ NA KLIENTA — počet rokov na trhu
    foundedYear: null,      // ČAKÁ NA KLIENTA
    servicedLifts: null,    // ČAKÁ NA KLIENTA — počet servisovaných výťahov
    technicians: null,      // ČAKÁ NA KLIENTA — počet technikov
  },

  /* ---- odbornosť ---------------------------------------------------- */
  certifications: [],       // ČAKÁ NA KLIENTA — [{ name, issuer, number, validUntil }]
  equipmentTypes: [],       // ČAKÁ NA KLIENTA — typy zariadení (lanové, hydraulické…)
  brands: [],               // ČAKÁ NA KLIENTA — podporované značky výťahov

  /* ---- právne údaje ------------------------------------------------- */
  legal: {
    ico: null,              // ČAKÁ NA KLIENTA
    dic: null,              // ČAKÁ NA KLIENTA
    icDph: null,            // ČAKÁ NA KLIENTA
    registration: null,     // ČAKÁ NA KLIENTA — zápis v OR SR
    dpo: null,              // zodpovedná osoba za GDPR, ak je určená
  },

  /* ---- identita značky ---------------------------------------------- */
  brand: {
    logo: null,             // ČAKÁ NA KLIENTA — cesta k SVG logu
    logoInverse: null,      // ČAKÁ NA KLIENTA — svetlá verzia loga
    colors: null,           // ČAKÁ NA KLIENTA — firemné farby (zatiaľ dočasná paleta)
    ogImage: '/assets/og-default.svg', // DOČASNÉ — treba 1200×630 PNG/JPG
  },

  /* ---- profily ------------------------------------------------------ */
  profiles: {
    googleBusiness: null,   // ČAKÁ NA KLIENTA
    facebook: null,
    linkedin: null,
  },
};

/* -------------------------------------------------------------------- */
/*  Kritické údaje pre produkčný build.                                  */
/*  Build s prepínačom --prod zlyhá, ak niektorý z nich chýba.           */
/* -------------------------------------------------------------------- */
export const productionRequirements = [
  ['contact.phone',      company.contact.phone,      'Hlavné telefónne číslo'],
  ['contact.email',      company.contact.email,      'Hlavný e-mail'],
  ['address.street',     company.address.street,     'Ulica a číslo'],
  ['address.postalCode', company.address.postalCode, 'PSČ'],
  ['legal.ico',          company.legal.ico,          'IČO (povinný údaj na webe)'],
  ['legal.registration', company.legal.registration, 'Zápis v obchodnom registri'],
];
