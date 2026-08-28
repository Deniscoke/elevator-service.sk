/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — referencie a segmenty zákazníkov
 *
 * ⚠ DÔLEŽITÉ — SÚHLAS
 * Klient v dotazníku uviedol: „Pri každej referencii sa treba najskôr dohodnúť."
 * To NIE JE súhlas so zverejnením. Všetky tri referencie majú preto
 * consent: false a na webe sa NEZOBRAZUJÚ.
 *
 * Sú tu pripravené, aby ich po dohode so zákazníkom stačilo prepnúť
 * na consent: true a doplniť popis. Nič iné meniť netreba.
 */

export const references = [
  {
    id: 'sbd-banska-bystrica',
    title: 'Nové výťahy, rekonštrukcie a modernizácie',
    objectType: 'sprava',
    city: 'Banská Bystrica',
    year: null,
    serviceId: 'modernizacia',
    clientName: 'SBD Banská Bystrica',
    summary: null,          // doplniť po dohode so zákazníkom
    image: null,
    consent: false,         // ⚠ ČAKÁ NA SÚHLAS ZÁKAZNÍKA
  },
  {
    id: 'realbyt-vk',
    title: 'Nové výťahy, rekonštrukcie a modernizácie',
    objectType: 'sprava',
    city: null,
    year: null,
    serviceId: 'modernizacia',
    clientName: 'REALBYT V. K.',
    summary: null,
    image: null,
    consent: false,         // ⚠ ČAKÁ NA SÚHLAS ZÁKAZNÍKA
  },
  {
    id: 'filbyt-filakovo',
    title: 'Nové výťahy, rekonštrukcie a modernizácie',
    objectType: 'sprava',
    city: 'Fiľakovo',
    year: null,
    serviceId: 'modernizacia',
    clientName: 'FILBYT Fiľakovo',
    summary: null,
    image: null,
    consent: false,         // ⚠ ČAKÁ NA SÚHLAS ZÁKAZNÍKA
  },
];

export const testimonials = []; // ČAKÁ NA KLIENTA

/**
 * Segmenty, pre ktoré sú služby určené.
 * Poradie zodpovedá odpovedi klienta na otázku, aký typ zákazníkov
 * chce získavať najviac: bytové domy/SVB, správcovia, firmy,
 * verejné inštitúcie, developeri.
 *
 * POZOR: toto NIE SÚ existujúci klienti. Formulácie na webe musia znieť
 * „komu je služba určená", nie „naši klienti".
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
    id: 'institucie',
    title: 'Verejné inštitúcie',
    text: 'Úrady, školy a zdravotnícke zariadenia, kde je výťah často jedinou bezbariérovou cestou medzi podlažiami.',
  },
  {
    id: 'developeri',
    title: 'Developeri a nové objekty',
    text: 'Prevzatie nových zariadení do servisu vrátane nastavenia harmonogramu od prvého dňa prevádzky.',
  },
];
