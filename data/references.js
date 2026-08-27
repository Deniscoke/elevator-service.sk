/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — referencie a segmenty zákazníkov
 *
 * references[] je ZÁMERNE PRÁZDNE.
 * Kým klient nedodá reálne realizácie so súhlasom na zverejnenie,
 * sekcia referencií sa na webe nevykreslí.
 */

/**
 * Tvar jednej referencie (pre budúce doplnenie):
 * {
 *   id: 'bd-tulska',
 *   title: 'Výmena riadenia, bytový dom',
 *   objectType: 'bytovy-dom',
 *   city: 'Banská Bystrica',
 *   year: 2024,
 *   serviceId: 'modernizacia',
 *   summary: 'Čo sa robilo a prečo.',
 *   image: { src: '/assets/referencie/...', alt: '...', width: 800, height: 600 },
 *   consent: true,            // POVINNÉ — súhlas so zverejnením
 *   clientName: null,         // len ak je súhlas s uvedením mena
 * }
 */
export const references = [];

export const testimonials = []; // ČAKÁ NA KLIENTA — žiadne vymyslené hodnotenia

/**
 * Segmenty, pre ktoré sú služby určené.
 * POZOR: toto NIE SÚ existujúci klienti. Formulácie na webe musia znieť
 * "komu je služba určená", nie "naši klienti".
 */
export const segments = [
  {
    id: 'bytove-domy',
    title: 'Bytové domy a SVB',
    text: 'Spoločenstvá vlastníkov a bytové domy, kde výťah používajú desiatky ľudí denne a odstávka je hneď vidieť.',
  },
  {
    id: 'spravcovia',
    title: 'Správcovské spoločnosti',
    text: 'Správcovia s viacerými objektmi, ktorí potrebujú prehľad o termínoch, dokumentácii a stave zariadení.',
  },
  {
    id: 'firmy',
    title: 'Firmy a administratívne budovy',
    text: 'Objekty, kde je výťah súčasťou každodennej prevádzky a porucha zdržuje ľudí aj tovar.',
  },
  {
    id: 'skoly',
    title: 'Školy a inštitúcie',
    text: 'Verejné budovy, kde je výťah často jedinou bezbariérovou cestou medzi podlažiami.',
  },
  {
    id: 'priemysel',
    title: 'Priemyselné objekty',
    text: 'Nákladné a osobno-nákladné zariadenia s náročnejšou prevádzkou a vyššou záťažou.',
  },
];
