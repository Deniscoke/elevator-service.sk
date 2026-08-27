/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — editoriálne bloky
 *
 * Sem patrí obsah, ktorý sa opakuje na viacerých stránkach a klient ho
 * bude chcieť meniť bez zásahu do šablón.
 *
 * PRAVIDLO: nič tu netvrdí vlastnosti firmy („sme spoľahliví", „máme
 * najrýchlejší výjazd"). Bloky opisujú buď problém zákazníka, alebo
 * priebeh spolupráce — teda veci pravdivé aj bez discovery údajov.
 */

/**
 * Problémy, s ktorými zákazník prichádza.
 * Nahrádzajú typickú sekciu „Prečo my" — návštevník sa spozná v situácii
 * a klikne rovno na službu, ktorá ju rieši.
 */
export const problems = [
  {
    title: 'Výťah sa opakovane kazí',
    text: 'Tá istá porucha sa vracia, výjazdy sa množia a nikto nepovedal, čo je príčina.',
    serviceId: 'opravy',
    linkLabel: 'Opravy výťahov',
  },
  {
    title: 'Nemáme prehľad o termínoch prehliadok',
    text: 'Nie je jasné, kedy bol posledný úkon, kedy je ďalší a kde je dokumentácia k zariadeniu.',
    serviceId: 'prehliadky',
    linkLabel: 'Prehliadky a skúšky',
  },
  {
    title: 'Servisná firma nereaguje',
    text: 'Nahlásená porucha visí, termíny sa posúvajú a spätnú väzbu si treba pýtať.',
    serviceId: 'servis',
    linkLabel: 'Pravidelný servis',
  },
  {
    title: 'Zariadenie je na hranici životnosti',
    text: 'Opravy sa kopia, diely sú ťažko dostupné a treba sa rozhodnúť, či ešte opravovať.',
    serviceId: 'modernizacia',
    linkLabel: 'Modernizácia',
  },
  {
    title: 'Vo výťahu uviazol človek',
    text: 'Situácia, ktorá neznesie odklad a treba vedieť, koho a ako volať.',
    serviceId: 'havaria',
    linkLabel: 'Havarijná služba',
  },
  {
    title: 'Preberáme objekt do správy',
    text: 'Nový objekt, neznámy stav zariadenia a potreba rýchlo zistiť, čo sa bude musieť riešiť.',
    serviceId: 'servis',
    linkLabel: 'Pravidelný servis',
  },
];

/**
 * Priebeh spolupráce pri prevzatí výťahu do servisu.
 * Opisuje cestu zákazníka, nie vlastnosti firmy.
 */
export const processServis = [
  {
    title: 'Dopyt',
    text: 'Napíšete nám adresu objektu, počet výťahov a čo o zariadení viete. Stačí orientačne.',
  },
  {
    title: 'Obhliadka',
    text: 'Pozrieme sa na zariadenie a dokumentáciu. Zistíme typ, vek a stav a čo bude treba riešiť prednostne.',
  },
  {
    title: 'Ponuka',
    text: 'Dostanete rozsah servisu, navrhnutý interval úkonov a cenu. Vrátane toho, čo v cene nie je.',
  },
  {
    title: 'Prevzatie zariadenia',
    text: 'Doriešime zmluvu, prevzatie dokumentácie a termín prvého úkonu. Pri zmene servisnej firmy poradíme s postupom.',
  },
  {
    title: 'Servis podľa harmonogramu',
    text: 'Chodíme v dohodnutých intervaloch, o každom úkone je zápis a termíny ďalších úkonov sledujeme za vás.',
  },
];

/** Priebeh opravy — kratší variant pre stránku opráv. */
export const processOprava = [
  { title: 'Nahlásenie', text: 'Popíšete, čo sa deje a na akom zariadení. Fotografia štítku pomôže.' },
  { title: 'Diagnostika', text: 'Zistíme príčinu, nie len prejav. Povieme vám, čo je naliehavé a čo znesie odklad.' },
  { title: 'Ponuka', text: 'Rozsah prác, potrebné diely, cena a termín — pred začiatkom prác.' },
  { title: 'Oprava', text: 'Realizácia v dohodnutom termíne, zápis do dokumentácie zariadenia.' },
];

/** Priebeh modernizácie. */
export const processModernizacia = [
  { title: 'Obhliadka a posúdenie', text: 'Prejdeme stav zariadenia, históriu opráv a dostupnosť dielov.' },
  { title: 'Návrh rozsahu', text: 'Čo sa oplatí meniť, čo môže zostať a v akom poradí to má zmysel robiť.' },
  { title: 'Ponuka a harmonogram', text: 'Cena, termín a predpokladaná dĺžka odstávky, aby ste ju vedeli oznámiť.' },
  { title: 'Realizácia', text: 'Práce v dohodnutých etapách s priebežnou informáciou o stave.' },
  { title: 'Odovzdanie', text: 'Uvedenie do prevádzky, dokumentácia a zaškolenie obsluhy, ak je potrebné.' },
];

/**
 * Čo zákazník dostane — konkrétne výstupy, nie sľuby.
 * Každá položka je overiteľná: buď ju dostane, alebo nie.
 */
export const deliverables = [
  { title: 'Zápis z každého úkonu', text: 'Viete, kto bol na zariadení, čo robil a čo zistil.' },
  { title: 'Cenová ponuka pred prácami', text: 'Rozsah a cena vopred. Bez prekvapení vo faktúre.' },
  { title: 'Sledovanie termínov', text: 'Ozveme sa pred termínom úkonu, nemusíte si ho strážiť sami.' },
  { title: 'Jeden kontakt', text: 'Servis, prehliadky aj opravy rieši jedna firma, nie tri.' },
];
