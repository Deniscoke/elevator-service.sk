/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — referencie a segmenty zákazníkov
 *
 * ⚠ SÚHLAS SO ZVEREJNENÍM
 * Klient v dotazníku uviedol: „Pri každej referencii sa treba najskôr dohodnúť."
 * To NIE JE súhlas. Všetky záznamy majú preto consent: false a na webe
 * sa NEZOBRAZUJÚ.
 *
 * ⚠ MENÁ ZÁKAZNÍKOV TU NIE SÚ
 * Tento repozitár je verejný. Meno zákazníka bez jeho súhlasu sa doň
 * nepíše — ani do zakomentovaného kódu. Zoznam konkrétnych referencií
 * má klient vo svojom dotazníku. Meno sa sem doplní až spolu
 * s consent: true, teda vo chvíli, keď je zverejnenie dohodnuté.
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
    id: 'referencia-1',
    title: 'Nové výťahy, rekonštrukcie a modernizácie',
    objectType: 'sprava',
    city: 'Banská Bystrica',
    year: null,
    serviceId: 'modernizacia',
    clientName: null,       // ⚠ doplniť až so súhlasom zákazníka
    summary: null,          // doplniť po dohode so zákazníkom
    logo: null,
    image: null,
    consent: false,         // ⚠ ČAKÁ NA SÚHLAS ZÁKAZNÍKA
  },
  {
    id: 'referencia-2',
    title: 'Nové výťahy, rekonštrukcie a modernizácie',
    objectType: 'sprava',
    city: null,
    year: null,
    serviceId: 'modernizacia',
    clientName: null,       // ⚠ doplniť až so súhlasom zákazníka
    summary: null,
    logo: null,
    image: null,
    consent: false,         // ⚠ ČAKÁ NA SÚHLAS ZÁKAZNÍKA
  },
  {
    id: 'referencia-3',
    title: 'Nové výťahy, rekonštrukcie a modernizácie',
    objectType: 'sprava',
    city: 'Fiľakovo',
    year: null,
    serviceId: 'modernizacia',
    clientName: null,       // ⚠ doplniť až so súhlasom zákazníka
    summary: null,
    logo: null,
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
