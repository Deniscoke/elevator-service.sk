/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — referencie a segmenty zákazníkov
 *
 * SÚHLAS SO ZVEREJNENÍM
 * Klient 9. 9. 2026 potvrdil, že referencie sú schválené a mená
 * zákazníkov sa smú zverejniť. Záznamy majú preto consent: true.
 *
 * Pravidlo zostáva: `consent: false` = záznam sa nikde nevykreslí.
 * Nový zákazník sa sem pridáva až vtedy, keď je zverejnenie dohodnuté —
 * repozitár je verejný, takže meno bez súhlasu doň nepatrí.
 *
 * Štruktúra záznamu je pripravená tak, aby stačilo doplniť údaje:
 *   clientName  meno zákazníka        (len so súhlasom)
 *   serviceId   ktorá služba
 *   city        lokalita              (nepovinné)
 *   summary     krátky popis          (nepovinné)
 *   logo        logo zákazníka        (len so súhlasom)
 *   image       fotografia realizácie (len so súhlasom)
 */

export const references = [
  {
    id: 'sbd-banska-bystrica',
    clientName: 'SBD Banská Bystrica',
    objectType: 'druzstvo',
    city: 'Banská Bystrica',
    year: null,
    serviceId: 'modernizacia',
    title: 'Nové výťahy, rekonštrukcie a modernizácie',
    summary: null,
    logo: null,
    image: null,
    consent: true,          // schválené klientom 9. 9. 2026
  },
  {
    id: 'realbyt-vk',
    clientName: 'REALBYT V. K.',
    objectType: 'sprava',
    city: null,
    year: null,
    serviceId: 'modernizacia',
    title: 'Nové výťahy, rekonštrukcie a modernizácie',
    summary: null,
    logo: null,
    image: null,
    consent: true,          // schválené klientom 9. 9. 2026
  },
  {
    id: 'filbyt-filakovo',
    clientName: 'FILBYT Fiľakovo',
    objectType: 'sprava',
    city: 'Fiľakovo',
    year: null,
    serviceId: 'modernizacia',
    title: 'Nové výťahy, rekonštrukcie a modernizácie',
    summary: null,
    logo: null,
    image: null,
    consent: true,          // schválené klientom 9. 9. 2026
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
