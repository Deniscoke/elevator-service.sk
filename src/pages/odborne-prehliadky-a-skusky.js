/**
 * /odborne-prehliadky-a-skusky/
 * Cieľové témy: odborná prehliadka výťahu, revízia výťahu, odborná skúška výťahu
 *
 * ⚠ NEEDS_EXPERT_VERIFICATION
 * Táto stránka sa vedome VYHÝBA uvedeniu konkrétnych zákonných lehôt,
 * periodicity a odkazov na predpisy. Kým ich neoverí odborník klienta,
 * text hovorí o priebehu a rozsahu úkonu, nie o legislatíve.
 * Miesta na doplnenie sú vedené v docs/EXPERT_VERIFICATION.md.
 */

import { buildServicePage } from '../lib/service-page.js';
import { serviceById } from '../../data/services.js';
import { faq } from '../../data/faq.js';

const process = [
  { title: 'Dohoda termínu', text: 'Termín naplánujeme tak, aby čo najmenej zasiahol do prevádzky objektu.' },
  { title: 'Príprava zariadenia', text: 'Skontrolujeme dostupnosť dokumentácie a prístup k technológii.' },
  { title: 'Vykonanie úkonu', text: 'Prehliadka alebo skúška v rozsahu, ktorý zodpovedá typu zariadenia.' },
  { title: 'Správa a zápis', text: 'Dostanete správu so zistením a záznam zostáva v dokumentácii zariadenia.' },
  { title: 'Riešenie nedostatkov', text: 'Ak sa niečo zistí, dostanete návrh odstránenia aj cenovú ponuku.' },
];

export default function page(ctx) {
  return buildServicePage(ctx, {
    service: serviceById.prehliadky,
    inquiryType: 'prehliadka-skuska',
    lead:
      'Zabezpečíme termín, vykonanie úkonu aj dokumentáciu. A ustrážime, kedy je zariadenie ' +
      'na rade nabudúce.',
    secondaryCta: { label: 'Ako to prebieha', href: '#ako-to-prebieha' },

    intro: [
      'Odborná prehliadka a odborná skúška sú dva rôzne úkony s odlišným rozsahom. ' +
        'Oba slúžia na to, aby bolo doložené, v akom stave zariadenie je — a aby sa prípadný ' +
        'nedostatok zistil skôr, než sa prejaví poruchou alebo úrazom.',
      'Rozsah a periodicita závisia od typu zariadenia a jeho prevádzky. Pri obhliadke ' +
        'prejdeme dokumentáciu vášho výťahu a povieme vám presne, ktorý úkon sa ho týka ' +
        'a kedy je na rade.',
      'Najčastejší problém, s ktorým sa stretávame, nie je samotný úkon. Je ním to, že ' +
        'v objekte nikto presne nevie, kedy bol vykonaný naposledy a kde je zápis. ' +
        'Pri zariadeniach v našom servise vedieme evidenciu termínov za vás.',
    ],

    aside: {
      title: 'Čo si pripraviť',
      items: [
        'Adresu objektu a počet zariadení',
        'Dokumentáciu zariadenia, ak ju máte',
        'Poslednú správu z prehliadky alebo skúšky',
        'Údaje z výrobného štítku',
        'Kontakt na osobu, ktorá zabezpečí prístup',
      ],
    },

    signalsTitle: 'Kedy sa na nás obrátiť',
    signals: [
      {
        title: 'Blíži sa termín úkonu',
        text: 'Potrebujete ho naplánovať tak, aby čo najmenej zasiahol do prevádzky.',
      },
      {
        title: 'Neviete, kedy bol posledný úkon',
        text: 'Chýba zápis alebo sa dokumentácia pri zmene správcu stratila.',
      },
      {
        title: 'Prebrali ste objekt do správy',
        text: 'Potrebujete zistiť stav zariadenia a doložiť ho dokumentáciou.',
      },
      {
        title: 'Zo správy vyplynuli nedostatky',
        text: 'Treba ich odstrániť a doložiť, že sa tak stalo.',
      },
      {
        title: 'Zariadenie prešlo modernizáciou',
        text: 'Po zásahu do technológie treba nastaviť ďalší režim kontrol.',
      },
      {
        title: 'Pripravujete podklady pre vlastníkov',
        text: 'Potrebujete doložiť stav zariadenia na schôdzi alebo pri rozpočte.',
      },
    ],

    includesTitle: 'Čo zabezpečíme',
    includes: [
      { title: 'Naplánovanie termínu', text: 'S ohľadom na prevádzku objektu a dostupnosť osoby, ktorá zabezpečí prístup.' },
      { title: 'Vykonanie úkonu', text: 'Odborná prehliadka alebo odborná skúška podľa typu zariadenia.' },
      { title: 'Správa o vykonaní', text: 'Zrozumiteľný výstup so zisteným stavom a prípadnými nedostatkami.' },
      { title: 'Zápis do dokumentácie', text: 'Záznam zostáva pri zariadení a je k dispozícii, keď ho treba doložiť.' },
      { title: 'Návrh na odstránenie nedostatkov', text: 'Popis, čo treba urobiť, spolu s cenovou ponukou.' },
      { title: 'Evidencia termínov', text: 'Pri zariadeniach v našom servise sledujeme, kedy je ďalší úkon na rade.' },
    ],

    process,
    processTitle: 'Ako úkon prebieha',

    /* Bezpečnostná poznámka namiesto konkrétnej lehoty. */
    extraSection: `
  <section class="section section--tight">
    <div class="container container--narrow">
      <div class="callout">
        <p class="callout__title">Interval závisí od zariadenia</p>
        <p>
          Periodicita odborných prehliadok a skúšok nie je pre všetky výťahy rovnaká —
          závisí od typu zariadenia, jeho vyhotovenia a prevádzky. Preto tu neuvádzame
          univerzálne číslo. Pri obhliadke prejdeme dokumentáciu vášho zariadenia
          a dostanete konkrétny harmonogram preň.
        </p>
      </div>
    </div>
  </section>`,

    audience: {
      title: 'Pre koho úkony zabezpečujeme',
      items: [
        { title: 'Spoločenstvá vlastníkov', text: 'Vrátane podkladov, ktoré sa hodia na schôdzu vlastníkov.' },
        { title: 'Správcovské spoločnosti', text: 'Evidencia termínov naprieč viacerými objektmi na jednom mieste.' },
        { title: 'Firmy a inštitúcie', text: 'Plánovanie úkonov tak, aby zasiahli prevádzku čo najmenej.' },
        { title: 'Nové objekty v správe', text: 'Zistenie východiskového stavu zariadenia a jeho doloženie.' },
      ],
    },

    faq: faq.prehliadky,

    ctaTitle: 'Potrebujete naplánovať prehliadku alebo skúšku?',
    ctaText: 'Napíšte nám adresu objektu a počet zariadení. Ozveme sa s termínom aj cenou.',
  });
}
