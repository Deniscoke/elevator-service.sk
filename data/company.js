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
 *  Zdroj údajov: dotazník „Doplňujúce otázky k novému webu" (28. 8. 2026).
 *  Údaje označené ako ČAKÁ NA KLIENTA v dotazníku neboli.
 * ══════════════════════════════════════════════════════════════════
 */

export const company = {
  /* ---- identita ---------------------------------------------------- */
  name: 'ELEVÁTOR SERVIS',
  legalName: 'ELEVÁTOR SERVIS, s.r.o.',
  claim: 'Servis, opravy a modernizácia výťahov',

  /* ---- web --------------------------------------------------------- */
  // Klient v dotazníku uviedol „Neviem" k zachovaniu domény.
  // Dovtedy pracujeme s existujúcou doménou.
  siteUrl: process.env.SITE_URL || 'https://www.elevatorservis.sk',
  locale: 'sk_SK',
  lang: 'sk',

  /* ---- kontakt ----------------------------------------------------- */
  contact: {
    phone: '+421 905 365 177',
    phoneNote: 'Hlavná linka',
    // Klient uviedol rovnaké číslo pre bežné dopyty aj havárie.
    emergencyPhone: '+421 905 365 177',
    email: 'elevator@elevatorservis.sk',
    emailCareers: null,     // ČAKÁ NA KLIENTA — zatiaľ sa použije hlavný e-mail
  },

  /* ---- adresa / prevádzka ------------------------------------------ */
  address: {
    street: null,           // ČAKÁ NA KLIENTA — v dotazníku nebolo
    city: 'Banská Bystrica',
    postalCode: null,       // ČAKÁ NA KLIENTA
    country: 'Slovensko',
    countryCode: 'SK',
    region: 'Banskobystrický kraj',
    mapUrl: null,           // ČAKÁ NA KLIENTA
    coordinates: null,      // ČAKÁ NA KLIENTA
  },

  /* ---- pracovné hodiny ---------------------------------------------- */
  openingHours: null,       // ČAKÁ NA KLIENTA — kancelária; havarijná linka je nonstop

  /* ---- havarijná služba -------------------------------------------- */
  // POTVRDENÉ klientom v dotazníku: „Áno – 24/7".
  emergency: {
    enabled: true,
    mode: 'nonstop',
    hoursLabel: 'Nonstop, 24 hodín denne',
    // Klientom uvedený záväzok: „nahlásené poruchy sa riešia do max. 1 hod."
    responseTimeNote: 'Reakcia na nahlásenú poruchu do 1 hodiny',
  },

  /* ---- čísla do trust layeru --------------------------------------- */
  stats: {
    yearsInBusiness: 26,
    foundedYear: null,      // ČAKÁ NA KLIENTA — dopočítať sa nedá presne
    servicedLifts: '300+',
    technicians: null,      // ČAKÁ NA KLIENTA
  },

  /* ---- odbornosť ---------------------------------------------------- */
  // Presné znenie podľa dotazníka. Význam jednotlivých paragrafov
  // zámerne nevysvetľujeme — to je vec odborne spôsobilej osoby.
  certifications: [
    { name: 'Osvedčenie podľa § 16', issuer: 'vyhláška č. 508/2009 Z. z.', number: null },
    { name: 'Osvedčenie podľa § 18', issuer: 'vyhláška č. 508/2009 Z. z.', number: null },
    { name: 'Osvedčenie podľa § 22', issuer: 'vyhláška č. 508/2009 Z. z.', number: null },
    { name: 'Osvedčenie podľa § 23', issuer: 'vyhláška č. 508/2009 Z. z.', number: null },
  ],

  equipmentTypes: ['Osobné výťahy', 'Nákladné výťahy', 'Malé nákladné výťahy'],

  // Klient uviedol, že servis závisí od konkrétneho zariadenia —
  // preto sú značky uvedené ako najčastejšie, nie ako výhradné.
  brands: [
    'TRANSPORTA Brno',
    'GLOBAL LIFT Bratislava',
    'TREVA Bratislava',
    'LIFTCOMPONENTS Karviná',
  ],
  brandsNote: 'Možnosť servisu posudzujeme podľa konkrétneho zariadenia.',

  /* ---- právne údaje ------------------------------------------------- */
  legal: {
    ico: null,              // ČAKÁ NA KLIENTA — v dotazníku nebolo
    dic: null,              // ČAKÁ NA KLIENTA
    icDph: null,            // ČAKÁ NA KLIENTA
    registration: null,     // ČAKÁ NA KLIENTA
    dpo: null,
  },

  /* ---- identita značky ---------------------------------------------- */
  brand: {
    // Logo prekreslené do SVG podľa dodaného PNG — klient má logo
    // iba v rastri. Pred spustením nech tvar odsúhlasí.
    // Klient má logo iba v PNG/JPG. Značku sme prekreslili do vektoru
    // (static/assets/logo.svg + inline v hlavičke), ale kým ju klient
    // neodsúhlasí, necháme požiadavku otvorenú.
    logo: null,
    logoInverse: null,
    // Žltá prevzatá z loga, grafitová z typografie loga.
    colors: { yellow: '#FFC61A', ink: '#12161B' },
    ogImage: '/assets/og-default.svg', // DOČASNÉ — treba 1200×630 PNG/JPG
  },

  /* ---- profily ------------------------------------------------------ */
  profiles: {
    // Klient uviedol, že k firemnému profilu na Google nemá prístup.
    // Založenie/prevzatie je súčasťou balíka Rast.
    googleBusiness: null,
    facebook: null,
    linkedin: null,
  },

  /* ---- pozicioning --------------------------------------------------- */
  // Odpoveď klienta na otázku „Prečo si má zákazník vybrať práve vás".
  // Používa sa na stránke O nás. Sú to jeho tvrdenia, nie naše.
  differentiators: [
    {
      title: 'Reakcia do jednej hodiny',
      text: 'Nahlásenú poruchu začíname riešiť najneskôr do hodiny od nahlásenia.',
    },
    {
      title: '26 rokov na jednom mieste',
      text: 'Výťahom sa venujeme od roku, keď väčšina dnes servisovaných zariadení ešte len vznikala.',
    },
    {
      title: 'Technici, ktorí závadu naozaj odstránia',
      text: 'Ťažisko práce je v diagnostike a oprave, nie v odkladaní na ďalší výjazd.',
    },
    {
      title: 'Nonstop havarijná linka',
      text: 'Jedno číslo, ktoré platí cez deň, v noci aj cez sviatky.',
    },
  ],
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
