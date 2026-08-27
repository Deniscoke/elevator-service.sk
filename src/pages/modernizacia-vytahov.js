/**
 * /modernizacia-vytahov/
 * Cieľové témy: modernizácia výťahu, rekonštrukcia výťahu, rekonštrukcia kabíny
 */

import { buildServicePage } from '../lib/service-page.js';
import { serviceById } from '../../data/services.js';
import { processModernizacia } from '../../data/content.js';
import { faq } from '../../data/faq.js';

export default function page(ctx) {
  return buildServicePage(ctx, {
    service: serviceById.modernizacia,
    inquiryType: 'modernizacia',
    lead:
      'Obnova výťahu po etapách alebo naraz — riadenie, pohon, dvere aj kabína. ' +
      'Riešenie pre zariadenia, kde sa opravy prestávajú oplácať.',
    secondaryCta: { label: 'Ako to prebieha', href: '#ako-to-prebieha' },

    intro: [
      'Modernizácia je rozhodnutie o peniazoch, nie o technike. Otázka neznie „dá sa to ešte ' +
        'opraviť" — takmer vždy sa dá. Otázka znie, či sa to ešte oplatí a či sa na zariadenie ' +
        'dajú zohnať diely.',
      'Pri obhliadke sa preto pozeráme na históriu opráv, dostupnosť komponentov a stav ' +
        'jednotlivých uzlov. Výsledkom je návrh, čo má zmysel vymeniť teraz, čo môže počkať ' +
        'a v akom poradí to robiť, aby sa práce nerobili dvakrát.',
      'Modernizácia sa nemusí robiť naraz. Rozdelenie do etáp býva pri bytových domoch ' +
        'praktickejšie — rozloží náklady a skráti jednotlivé odstávky.',
    ],

    aside: {
      title: 'Čo si pripraviť k obhliadke',
      items: [
        'Adresu objektu a počet výťahov',
        'Údaje z výrobného štítku',
        'Prehľad opráv za posledné roky',
        'Predstavu o rozpočte a časovom horizonte',
        'Informáciu, či ide o bytový dom alebo firemný objekt',
      ],
    },

    signalsTitle: 'Kedy uvažovať o modernizácii',
    signals: [
      {
        title: 'Náklady na opravy rastú',
        text: 'Ročná suma za opravy sa začína približovať k časti ceny obnovy.',
      },
      {
        title: 'Diely sa ťažko zháňajú',
        text: 'Na zariadenie sa už nevyrábajú komponenty a čakanie predlžuje odstávky.',
      },
      {
        title: 'Poruchy sa opakujú',
        text: 'Zariadenie je mimo prevádzky častejšie, než je pre obyvateľov únosné.',
      },
      {
        title: 'Kabína pôsobí opotrebovane',
        text: 'Technológia môže byť v poriadku, ale interiér už neplní svoju funkciu.',
      },
      {
        title: 'Plánujete obnovu domu',
        text: 'Má zmysel spojiť výťah s ostatnými prácami a využiť jeden zásah.',
      },
      {
        title: 'Zo správ vyplývajú opakované nedostatky',
        text: 'Rovnaké zistenia sa vracajú a jednorazové odstránenie ich nerieši.',
      },
    ],

    includesTitle: 'Čo vieme modernizovať',
    includesLead:
      'Rozsah sa vždy určuje po obhliadke — nie každé zariadenie potrebuje všetko naraz.',
    includes: [
      { title: 'Riadenie výťahu', text: 'Výmena riadiaceho systému vrátane ovládačov v kabíne a na staniciach.' },
      { title: 'Pohon', text: 'Obnova alebo výmena pohonnej jednotky podľa stavu a typu zariadenia.' },
      { title: 'Dvere', text: 'Šachtové aj kabínové dvere — najčastejší zdroj porúch a odstávok.' },
      { title: 'Kabína', text: 'Steny, podlaha, osvetlenie, zrkadlo, madlá a ovládací panel.' },
      { title: 'Bezpečnostné prvky', text: 'Doplnenie a obnova prvkov podľa stavu zariadenia.' },
      { title: 'Signalizácia a núdzové volanie', text: 'Obnova spojenia z kabíny a informačných prvkov.' },
      { title: 'Rekonštrukcia po etapách', text: 'Rozdelenie prác tak, aby na seba technicky nadväzovali.' },
      { title: 'Podklady pre vlastníkov', text: 'Rozsah, cena a harmonogram v podobe, ktorá sa dá predložiť na schôdzi.' },
    ],

    process: processModernizacia,
    processTitle: 'Ako modernizácia prebieha',

    audience: {
      title: 'Pre koho modernizáciu robíme',
      items: [
        { title: 'Bytové domy a SVB', text: 'Vrátane podkladov na rozhodovanie vlastníkov a rozloženia nákladov do etáp.' },
        { title: 'Správcovské spoločnosti', text: 'Plánovanie obnovy naprieč viacerými objektmi v čase.' },
        { title: 'Firmy a administratívne budovy', text: 'Obnova s dôrazom na čo najkratšiu odstávku.' },
        { title: 'Objekty pred rekonštrukciou', text: 'Zosúladenie prác na výťahu s ostatnou obnovou budovy.' },
      ],
    },

    faq: faq.modernizacia,

    ctaTitle: 'Chcete vedieť, či sa modernizácia oplatí?',
    ctaText:
      'Prídeme na obhliadku a povieme vám, čo má zmysel meniť teraz a čo môže počkať.',
  });
}
