/**
 * /servis-vytahov/
 * Cieľové témy: servis výťahov, servis výťahov Banská Bystrica, údržba výťahov
 *
 * Toto je najdôležitejšia stránka webu z obchodného hľadiska — vedie k
 * najhodnotnejšej konverzii (nový výťah do pravidelného servisu).
 */

import { buildServicePage } from '../lib/service-page.js';
import { serviceById } from '../../data/services.js';
import { segments } from '../../data/references.js';
import { processServis } from '../../data/content.js';
import { faq } from '../../data/faq.js';

export default function page(ctx) {
  return buildServicePage(ctx, {
    service: serviceById.servis,
    inquiryType: 'pravidelny-servis',
    lead:
      'Pravidelné prehliadky, mazanie, nastavenie a kontrola bezpečnostných prvkov — ' +
      'aby výťah fungoval a aby bol poriadok aj v jeho dokumentácii.',
    secondaryCta: { label: 'Ako prebieha prevzatie', href: '#ako-to-prebieha' },

    intro: [
      'Servis výťahu nie je len návšteva technika raz za čas. Je to sústavná starostlivosť ' +
        'o zariadenie, ktoré denne prepravuje ľudí — a zároveň evidencia, ktorá musí byť ' +
        'v poriadku, keď sa na ňu niekto opýta.',
      'Preberáme výťahy do pravidelného servisu v <strong>Banskej Bystrici a okolí</strong>. ' +
        'Pri obhliadke prejdeme zariadenie aj jeho dokumentáciu a navrhneme rozsah a interval ' +
        'úkonov podľa toho, o aký typ výťahu ide, koľko má rokov a ako intenzívne sa používa.',
      'Ak dnes servis riešite s inou firmou a nie ste spokojní, zmena je bežná vec. ' +
        'Povieme vám, čo bude treba pripraviť a v akom poradí.',
    ],

    aside: {
      title: 'Čo si pripraviť k dopytu',
      items: [
        'Adresu objektu',
        'Počet výťahov v objekte',
        'Typ zariadenia podľa výrobného štítku',
        'Približný rok výroby alebo poslednej modernizácie',
        'Poslednú správu z odbornej prehliadky, ak ju máte',
      ],
    },

    signalsTitle: 'Kedy má zmysel riešiť servis',
    signals: [
      {
        title: 'Preberáte objekt do správy',
        text: 'Potrebujete rýchlo zistiť, v akom stave zariadenie je a čo sa bude musieť riešiť.',
      },
      {
        title: 'Končí vám zmluva so servisnou firmou',
        text: 'Je vhodný čas porovnať rozsah a cenu — a nenechať to na poslednú chvíľu.',
      },
      {
        title: 'Servis nereaguje na nahlásené poruchy',
        text: 'Nahlásená závada visí týždne a spätnú väzbu si treba pýtať.',
      },
      {
        title: 'Nemáte prehľad o dokumentácii',
        text: 'Nie je jasné, kedy bol posledný úkon, kde sú zápisy a kedy je ďalší termín.',
      },
      {
        title: 'Výťah je po modernizácii',
        text: 'Nové zariadenie potrebuje nastavený servisný režim od začiatku, nie až po prvej poruche.',
      },
      {
        title: 'Poruchy sa začínajú množiť',
        text: 'Jednorazové opravy prestávajú stačiť a treba sa pozrieť na zariadenie ako celok.',
      },
    ],

    includesTitle: 'Čo pravidelný servis zahŕňa',
    includesLead:
      'Konkrétny rozsah sa dohodne pred podpisom zmluvy a zodpovedá typu a veku zariadenia.',
    includes: [
      {
        title: 'Preventívne prehliadky',
        text: 'Návštevy v dohodnutom intervale a kontrola zariadenia podľa dohodnutého rozsahu.',
      },
      {
        title: 'Mazanie a nastavenie',
        text: 'Ošetrenie a nastavenie pohyblivých častí, ktoré sa opotrebúvajú najrýchlejšie.',
      },
      {
        title: 'Kontrola bezpečnostných prvkov',
        text: 'Overenie funkčnosti prvkov, na ktorých závisí bezpečnosť cestujúcich.',
      },
      {
        title: 'Kontrola dverí a šachty',
        text: 'Najčastejší zdroj porúch. Kontrolujeme mechaniku aj funkciu dverí.',
      },
      {
        title: 'Signalizácia a núdzové volanie',
        text: 'Kontrola, či spojenie z kabíny naozaj funguje — nie len či svieti tlačidlo.',
      },
      {
        title: 'Zápis a dokumentácia',
        text: 'Z každého úkonu je záznam, takže viete, čo sa na zariadení dialo.',
      },
      {
        title: 'Sledovanie termínov',
        text: 'Strážime termíny úkonov a ozveme sa vopred, aby ste ich nepremeškali.',
      },
      {
        title: 'Návrhy na odstránenie závad',
        text: 'Ak niečo nájdeme, dostanete popis aj cenovú ponuku. Rozhodnutie je na vás.',
      },
    ],

    process: processServis,
    processTitle: 'Ako prebieha prevzatie výťahu do servisu',

    audience: {
      title: 'Pre koho je pravidelný servis určený',
      items: segments,
    },

    faq: faq.servis,

    ctaTitle: 'Vyžiadajte si ponuku na servis',
    ctaText:
      'Stačí adresa objektu a počet výťahov. Zvyšok doriešime pri obhliadke — nezáväzne.',
  });
}
