/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — služby
 *
 * Tu sú len fakty a metadáta o službe (URL, názvy, SEO).
 * Dlhý text stránky žije v src/pages/<slug>.js, aby sa dáta nemiešali s obsahom.
 *
 * Poradie v poli = poradie v navigácii aj na homepage.
 */

export const services = [
  {
    id: 'servis',
    slug: 'servis-vytahov',
    path: '/servis-vytahov/',
    navLabel: 'Servis výťahov',
    cardTitle: 'Pravidelný servis a údržba',
    h1: 'Servis výťahov Banská Bystrica',
    metaTitle: 'Servis výťahov Banská Bystrica | ELEVÁTOR SERVIS',
    metaDescription:
      'Pravidelný servis a údržba výťahov v Banskej Bystrici a okolí. Preventívne prehliadky, mazanie, nastavenie a kontrola bezpečnostných prvkov. Vyžiadajte si ponuku.',
    summary:
      'Preventívne prehliadky v dohodnutých intervaloch, mazanie a nastavenie mechanických častí, kontrola bezpečnostných prvkov a vedenie servisnej dokumentácie.',
    schemaName: 'Servis a údržba výťahov',
    icon: 'gear',
    primary: true,
  },
  {
    id: 'opravy',
    slug: 'opravy-vytahov',
    path: '/opravy-vytahov/',
    navLabel: 'Opravy výťahov',
    cardTitle: 'Opravy a výmena dielov',
    h1: 'Opravy výťahov',
    metaTitle: 'Oprava výťahu Banská Bystrica | ELEVÁTOR SERVIS',
    metaDescription:
      'Opravy výťahov v Banskej Bystrici a okolí — diagnostika poruchy, výmena opotrebovaných dielov, oprava dverí, pohonu a riadenia. Napíšte nám dopyt.',
    summary:
      'Diagnostika poruchy, oprava alebo výmena opotrebovaných dielov, riešenie opakujúcich sa závad a odstránenie nedostatkov zistených pri prehliadke.',
    schemaName: 'Opravy výťahov',
    icon: 'wrench',
    primary: true,
  },
  {
    id: 'prehliadky',
    slug: 'odborne-prehliadky-a-skusky',
    path: '/odborne-prehliadky-a-skusky/',
    navLabel: 'Prehliadky a skúšky',
    cardTitle: 'Odborné prehliadky a skúšky',
    h1: 'Odborné prehliadky a odborné skúšky výťahov',
    metaTitle: 'Odborná prehliadka a skúška výťahu | ELEVÁTOR SERVIS',
    metaDescription:
      'Odborné prehliadky a odborné skúšky výťahov (revízie) v Banskej Bystrici a okolí. Zabezpečíme termín, vykonanie aj dokumentáciu k zariadeniu.',
    summary:
      'Zabezpečenie odborných prehliadok a odborných skúšok vrátane sprievodnej dokumentácie a evidencie zistených nedostatkov.',
    schemaName: 'Odborné prehliadky a skúšky výťahov',
    icon: 'clipboard',
    primary: true,
  },
  {
    id: 'modernizacia',
    slug: 'modernizacia-vytahov',
    path: '/modernizacia-vytahov/',
    navLabel: 'Modernizácia',
    cardTitle: 'Modernizácia a rekonštrukcia',
    h1: 'Modernizácia a rekonštrukcia výťahov',
    metaTitle: 'Modernizácia výťahu a rekonštrukcia kabíny | ELEVÁTOR SERVIS',
    metaDescription:
      'Modernizácia výťahov a rekonštrukcia kabín v Banskej Bystrici a okolí — obnova riadenia, pohonu, dverí a interiéru kabíny. Vyžiadajte si obhliadku.',
    summary:
      'Čiastočná alebo úplná obnova výťahu — riadenie, pohon, dvere, kabína. Riešenie pre zariadenia, kde sa opravy prestávajú oplácať.',
    schemaName: 'Modernizácia a rekonštrukcia výťahov',
    icon: 'upgrade',
    primary: true,
  },
  {
    id: 'havaria',
    slug: 'havarijna-sluzba',
    path: '/havarijna-sluzba/',
    navLabel: 'Havarijná služba',
    cardTitle: 'Havarijná služba',
    h1: 'Havarijná služba a vyslobodzovanie osôb z výťahu',
    metaTitle: 'Havarijný servis výťahov | Porucha výťahu | ELEVÁTOR SERVIS',
    metaDescription:
      'Havarijná služba pri poruche výťahu a vyslobodzovanie osôb uviaznutých v kabíne. Banská Bystrica a okolie. Postup pri uviaznutí vo výťahu.',
    summary:
      'Výjazd pri poruche zariadenia a vyslobodenie osôb uviaznutých v kabíne. Uvedenie výťahu do bezpečného stavu.',
    schemaName: 'Havarijná služba výťahov',
    icon: 'alert',
    primary: true,
    isEmergency: true,
  },
];

export const serviceById = Object.fromEntries(services.map((s) => [s.id, s]));

/** Typy dopytu vo formulári — musia zodpovedať službám vyššie. */
export const inquiryTypes = [
  { value: 'pravidelny-servis', label: 'Pravidelný servis (nová zmluva)' },
  { value: 'oprava',            label: 'Oprava / porucha' },
  { value: 'prehliadka-skuska', label: 'Odborná prehliadka alebo skúška' },
  { value: 'modernizacia',      label: 'Modernizácia alebo rekonštrukcia' },
  { value: 'ine',               label: 'Iné' },
];

/** Typy objektov — pomáhajú kvalifikovať dopyt. */
export const objectTypes = [
  { value: 'bytovy-dom',    label: 'Bytový dom / SVB' },
  { value: 'sprava',        label: 'Správcovská spoločnosť' },
  { value: 'administrativa',label: 'Administratívna budova' },
  { value: 'priemysel',     label: 'Priemyselný objekt' },
  { value: 'skola',         label: 'Škola alebo inštitúcia' },
  { value: 'obchod',        label: 'Obchodná prevádzka' },
  { value: 'ine',           label: 'Iné' },
];
