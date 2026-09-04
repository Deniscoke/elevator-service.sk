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
  // Produkčná doména. Kanonická je apex bez www; www na ňu presmeruje
  // (presmerovanie je vo vercel.json).
  siteUrl: process.env.SITE_URL || 'https://elevatorservis.sk',
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
  // OVERENÉ podľa verejného obchodného registra.
  address: {
    street: 'Rudohorská 22',
    city: 'Banská Bystrica',
    postalCode: '974 11',
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
    hoursLabel: 'Nonstop, 24 hodín denne, 7 dní v týždni',
    // ČAKÁ NA KLIENTA — reakčný čas nie je zmluvne potvrdený, takže
    // web žiadny konkrétny čas nesľubuje. Prázdna hodnota = nezobrazí sa.
    responseTimeNote: null,
  },

  /* ---- čísla do trust layeru --------------------------------------- */
  stats: {
    // ČAKÁ NA KLIENTA — rok založenia a počet rokov na trhu nie sú overené.
    // Kým to klient nepotvrdí, web žiadny údaj o dĺžke pôsobenia neuvádza.
    yearsInBusiness: null,
    foundedYear: null,      // ČAKÁ NA KLIENTA — dopočítať sa nedá presne
    servicedLifts: '300+',
    technicians: null,      // ČAKÁ NA KLIENTA
  },

  /* ---- odbornosť ---------------------------------------------------- */
  // Presné znenie podľa dotazníka. Význam jednotlivých paragrafov
  // zámerne nevysvetľujeme — to je vec odborne spôsobilej osoby.
  // ČAKÁ NA KLIENTA — presný zoznam a rozsah platných oprávnení firmy
  // nie je doložený. Kým klient nedodá čísla osvedčení a ich rozsah,
  // sekcia sa nevykreslí. Nezverejňujeme ani ich počet.
  certifications: [],

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
    // OVERENÉ podľa verejného obchodného registra.
    ico: '36 045 641',
    dic: null,              // nie je verejne overené — nezobrazuje sa
    icDph: null,            // nie je verejne overené — nezobrazuje sa
    registration:
      'Obchodný register Okresného súdu Banská Bystrica, oddiel Sro, vložka č. 6832/S',
    // Dátum zápisu do obchodného registra. Je to overiteľný fakt, ale
    // sám osebe nie je tvrdením o dĺžke pôsobenia — na web sa nevypisuje,
    // kým klient neodsúhlasí konkrétnu formuláciu.
    registeredSince: '2000-12-22',
    dpo: null,
    // POTVRDENÉ klientom: interné pravidlo firmy, NIE zákonná lehota.
    // GDPR žiadne konkrétne číslo nestanovuje — hovorí, že údaje sa nemajú
    // uchovávať dlhšie, než je potrebné na účel. Znenie to musí odlíšiť.
    dataRetention:
      'Údaje z dopytu uchovávame najviac 2 roky od poslednej komunikácie s vami. ' +
      'Je to interné pravidlo našej spoločnosti — po uplynutí tejto doby údaje ' +
      'vymažeme, ak nás iná zákonná povinnosť alebo prebiehajúca zmluvná ' +
      'spolupráca nezaväzuje uchovať ich dlhšie.',
  },

  /* ---- identita značky ---------------------------------------------- */
  brand: {
    // Oficiálne logo dodané klientom. Zdroj pravdy je
    // static/assets/brand/logo-master.png; ostatné varianty sú z neho
    // odvodené len orezaním a odstránením bieleho pozadia — kresba
    // sa nemenila. Nikdy sa neprekresľuje ani neprefarbuje.
    logo: '/assets/brand/logo.png',
    logoWidth: 640,
    logoHeight: 300,
    // Na tmavom podklade sa logo kladie na svetlú plochu (pozri
    // .logo--footer v 03-layout.css), aby si zachovalo pôvodné farby.
    logoInverse: null,
    // Samotný symbol bez textu — pre ikony a drobné použitie.
    symbol: '/assets/brand/mark.png',
    // Žltá prevzatá z loga, grafitová z typografie loga.
    colors: { yellow: '#FFC61A', ink: '#12161B' },
    // 1200×630 PNG — SVG sociálne siete v náhľade odkazu nevykreslia.
    ogImage: '/assets/og-default.png',
  },

  /* ---- integrácie ----------------------------------------------------
     Zapnú sa až po dodaní reálnych ID. Žiadne fake hodnoty — kým je tu
     null, príslušný tag sa do stránky vôbec nevloží. */
  integrations: {
    // Google Search Console: obsah meta tagu google-site-verification.
    searchConsoleVerification: null,
    // Analytika. Odporúčaná je bezcookie (Plausible/Umami) — nevyžaduje
    // súhlas ani cookie lištu. Pri GA4 treba doriešiť súhlas.
    analytics: {
      provider: null,   // 'plausible' | 'umami' | 'ga4'
      id: null,         // doména pri Plausible, websiteId pri Umami, G-XXXX pri GA4
      scriptUrl: null,  // pri self-hosted Umami
    },
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
  /* Zostávajú len tvrdenia, ktoré vieme doložiť potvrdenými údajmi
     alebo rozsahom služieb. Odstránené boli „Reakcia do jednej hodiny"
     (nepotvrdený záväzok) a „26 rokov na jednom mieste" (nepotvrdený
     a nepresný údaj o dĺžke pôsobenia). */
  differentiators: [
    {
      title: 'Nonstop havarijná linka',
      text: 'Jedno číslo, ktoré platí cez deň, v noci aj cez sviatky.',
    },
    {
      title: 'Celý cyklus u jedného dodávateľa',
      text: 'Servis, opravy, odborné prehliadky aj modernizácia — bez odovzdávania medzi firmami.',
    },
    {
      title: 'Zápis z každého úkonu',
      text: 'Z každého zásahu je záznam v dokumentácii zariadenia, takže je dohľadateľné, čo sa na výťahu dialo.',
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
  ['legal.dataRetention', company.legal.dataRetention, 'Doba uchovávania údajov z formulára (GDPR)'],
];
