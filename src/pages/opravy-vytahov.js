/**
 * /opravy-vytahov/
 * Cieľové témy: oprava výťahu, opravy výťahov Banská Bystrica
 */

import { buildServicePage } from '../lib/service-page.js';
import { serviceById } from '../../data/services.js';
import { processOprava } from '../../data/content.js';
import { faq } from '../../data/faq.js';

export default function page(ctx) {
  return buildServicePage(ctx, {
    service: serviceById.opravy,
    inquiryType: 'oprava',
    lead:
      'Zistíme príčinu poruchy, nie len jej prejav. Dostanete rozsah prác a cenu ešte pred tým, ' +
      'než sa začne opravovať.',
    secondaryCta: { label: 'Uviazol niekto vo výťahu?', href: '/havarijna-sluzba/' },

    intro: [
      'Porucha výťahu má takmer vždy konkrétnu príčinu. Problém býva v tom, že sa opakovane ' +
        'rieši prejav — vymení sa diel, výťah pár týždňov beží a potom sa to zopakuje. ' +
        'Pri diagnostike sa preto pozeráme aj na uzly, ktoré s poruchou súvisia.',
      'Opravy robíme na zariadeniach v našom servise aj na zariadeniach, ktoré bežne ' +
        'neservisujeme. Pri druhom prípade si najprv potrebujeme overiť typ a stav výťahu.',
      'Ak je vo výťahu uviaznutý človek, nejde o opravu, ale o havarijnú situáciu — ' +
        'postup nájdete na stránke <a href="/havarijna-sluzba/">havarijnej služby</a>.',
    ],

    aside: {
      title: 'Čo nám pomôže pri nahlásení',
      items: [
        'Adresa objektu a ktorý výťah v poradí',
        'Ako sa porucha prejavuje',
        'Kedy sa objavila prvýkrát',
        'Či sa už opakovala',
        'Fotografia výrobného štítku zariadenia',
      ],
    },

    signalsTitle: 'Kedy volať opravu',
    signals: [
      {
        title: 'Výťah nereaguje na privolanie',
        text: 'Zariadenie stojí, tlačidlá nereagujú alebo sa výťah nerozbehne.',
      },
      {
        title: 'Dvere sa neotvárajú správne',
        text: 'Zasekávajú sa, otvárajú sa pomaly, nedovierajú alebo sa otvárajú mimo stanice.',
      },
      {
        title: 'Zariadenie nezvyčajne hlučí alebo vibruje',
        text: 'Nový zvuk alebo chvenie býva prvý príznak opotrebenia.',
      },
      {
        title: 'Kabína nezastavuje v rovine',
        text: 'Rozdiel medzi podlahou kabíny a podlažím je riziko zakopnutia.',
      },
      {
        title: 'Nefunguje núdzové volanie alebo osvetlenie',
        text: 'Bezpečnostný prvok mimo prevádzky treba riešiť prednostne.',
      },
      {
        title: 'Prehliadka zistila nedostatok',
        text: 'Zo správy vyplynulo, čo treba odstrániť — a treba to niekomu zadať.',
      },
    ],

    includesTitle: 'Čo oprava zahŕňa',
    includes: [
      {
        title: 'Diagnostika príčiny',
        text: 'Zistenie, čo poruchu naozaj spôsobilo, vrátane súvisiacich uzlov.',
      },
      {
        title: 'Cenová ponuka pred prácami',
        text: 'Rozsah, potrebné diely, cena a termín. Bez prekvapení vo faktúre.',
      },
      {
        title: 'Výmena opotrebovaných dielov',
        text: 'Zabezpečenie dielov a ich výmena vrátane nastavenia.',
      },
      {
        title: 'Oprava dverí a ich mechaniky',
        text: 'Najčastejšia príčina odstávok. Riešime mechaniku aj funkciu.',
      },
      {
        title: 'Oprava pohonu a riadenia',
        text: 'Zásahy do technológie zariadenia podľa zisteného stavu.',
      },
      {
        title: 'Odstránenie nedostatkov z prehliadky',
        text: 'Práce podľa zápisu z odbornej prehliadky alebo skúšky.',
      },
      {
        title: 'Zápis do dokumentácie',
        text: 'Záznam o vykonanej oprave zostáva pri zariadení.',
      },
      {
        title: 'Odporúčanie ďalšieho postupu',
        text: 'Ak sa oprava prestáva oplácať, povieme to — aj s alternatívou.',
      },
    ],

    process: processOprava,
    processTitle: 'Ako prebieha oprava',

    audience: {
      title: 'Pre koho opravy robíme',
      items: [
        {
          title: 'Zariadenia v našom servise',
          text: 'Opravy sú súčasťou bežnej starostlivosti a poznáme históriu zariadenia.',
        },
        {
          title: 'Objekty bez servisnej zmluvy',
          text: 'Jednorazová oprava je možná po overení typu a stavu zariadenia.',
        },
        {
          title: 'Správcovia viacerých objektov',
          text: 'Riešenie porúch naprieč objektmi s jedným kontaktom a jednou evidenciou.',
        },
        {
          title: 'Opakované poruchy',
          text: 'Situácie, kde doterajšie opravy problém neodstránili.',
        },
      ],
    },

    faq: faq.opravy,

    ctaTitle: 'Nahláste poruchu',
    ctaText: 'Popíšte, čo sa deje. Čím konkrétnejší popis, tým rýchlejšia odpoveď.',
  });
}
