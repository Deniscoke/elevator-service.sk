/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — poradňa
 *
 * articles[] je ZÁMERNE PRÁZDNE.
 * Negenerujeme desiatky AI SEO článkov. Poradňa má vzniknúť z reálnych
 * otázok, ktoré firma dostáva od zákazníkov, a z overených technických faktov.
 *
 * Architektúra je hotová: po pridaní článku sa automaticky vygeneruje
 * /poradna/<slug>/, doplní sa do sitemap.xml, do výpisu poradne
 * aj do súvisiacich odkazov na stránke služby (podľa serviceId).
 */

/**
 * Tvar článku (pre budúce doplnenie):
 * {
 *   slug: 'ako-zmenit-servisnu-spolocnost',
 *   title: 'Ako zmeniť servisnú spoločnosť pre výťah',
 *   metaTitle: '…', metaDescription: '…',
 *   serviceId: 'servis',            // prepojenie na službu
 *   published: '2026-03-01',
 *   updated: null,
 *   perex: '…',
 *   body: [ { type: 'h2', text: '…' }, { type: 'p', text: '…' } ],
 *   verified: false,                // technické tvrdenia overené odborníkom?
 * }
 */
export const articles = [];

export const publishedArticles = articles.filter((a) => a.published && a.verified);

/**
 * Témy, ktoré má poradňa pokryť. Zobrazujú sa ako plán, nie ako hotové články,
 * a odkazujú na príslušnú stránku služby — takže sekcia má hodnotu už teraz.
 */
export const plannedTopics = [
  {
    title: 'Servis výťahu',
    text: 'Čo má obsahovať servisná zmluva, ako čítať zápis z prehliadky a čo si pýtať od servisnej firmy.',
    serviceId: 'servis',
  },
  {
    title: 'Odborné prehliadky a skúšky',
    text: 'Aký je rozdiel medzi prehliadkou a skúškou, kto zodpovedá za termíny a čo robiť so zisteným nedostatkom.',
    serviceId: 'prehliadky',
  },
  {
    title: 'Poruchy výťahov',
    text: 'Najčastejšie prejavy porúch, čo z nich vie posúdiť správca sám a kedy treba zavolať technika.',
    serviceId: 'opravy',
  },
  {
    title: 'Modernizácia a rekonštrukcia',
    text: 'Kedy sa oprava prestáva oplácať, ako plánovať obnovu po etapách a čo ovplyvňuje dĺžku odstávky.',
    serviceId: 'modernizacia',
  },
  {
    title: 'Zmena servisnej spoločnosti',
    text: 'Výpovedná lehota, odovzdanie dokumentácie a čo si postrážiť, aby zariadenie nezostalo bez servisu.',
    serviceId: 'servis',
  },
  {
    title: 'Správa výťahu v bytovom dome',
    text: 'Kto za čo zodpovedá, akú dokumentáciu má mať SVB po ruke a ako pripraviť rozpočet na obnovu.',
    serviceId: 'servis',
  },
];
