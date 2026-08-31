import { company } from './company.js';

/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — kariéra
 *
 * Pozície a ponuka podľa dotazníka (28. 8. 2026).
 * Mzdové rozpätie klient neuviedol — polia zostávajú null a na webe
 * sa mzda nezobrazuje. Nevymýšľame ju.
 */

export const positions = [
  {
    id: 'servisny-technik',
    slug: 'servisny-technik-vytahov',
    title: 'Servisný technik výťahov',
    location: 'Banská Bystrica a okolie',
    employmentType: 'FULL_TIME',
    salaryFrom: null,
    salaryTo: null,
    salaryPeriod: 'MONTH',
    currency: 'EUR',
    summary:
      'Pravidelný servis, odstraňovanie porúch a opravy osobných a nákladných výťahov u zákazníkov v regióne.',
    responsibilities: [
      'Preventívne prehliadky a údržba zariadení podľa harmonogramu',
      'Diagnostika a odstraňovanie porúch',
      'Výmena opotrebovaných dielov a nastavenie zariadenia',
      'Zápisy o vykonaných úkonoch do dokumentácie',
      'Účasť na havarijných výjazdoch podľa rozpisu',
    ],
    requirements: [
      'Technické myslenie a manuálna zručnosť',
      'Vodičský preukaz skupiny B',
      'Ochota učiť sa na konkrétnych typoch zariadení',
    ],
    niceToHave: [
      'Elektrotechnické vzdelanie alebo odborná spôsobilosť',
      'Skúsenosť so zdvíhacími zariadeniami',
    ],
    datePosted: '2026-08-28',
    validThrough: null,
  },
  {
    id: 'revizny-technik',
    slug: 'revizny-technik',
    title: 'Revízny technik',
    location: 'Banská Bystrica a okolie',
    employmentType: 'FULL_TIME',
    salaryFrom: null,
    salaryTo: null,
    salaryPeriod: 'MONTH',
    currency: 'EUR',
    summary:
      'Vykonávanie odborných prehliadok a odborných skúšok zdvíhacích zariadení vrátane sprievodnej dokumentácie.',
    responsibilities: [
      'Odborné prehliadky a odborné skúšky zariadení',
      'Spracovanie správ a zápisov',
      'Posúdenie zistených nedostatkov a návrh riešenia',
    ],
    requirements: [
      'Platná odborná spôsobilosť pre zdvíhacie zariadenia',
      'Vodičský preukaz skupiny B',
    ],
    niceToHave: ['Prax v oblasti výťahov'],
    datePosted: '2026-08-28',
    validThrough: null,
  },
  {
    id: 'elektrikar',
    slug: 'elektrikar',
    title: 'Elektrikár',
    location: 'Banská Bystrica a okolie',
    employmentType: 'FULL_TIME',
    salaryFrom: null,
    salaryTo: null,
    salaryPeriod: 'MONTH',
    currency: 'EUR',
    summary:
      'Elektroinštalačné práce na výťahoch — riadenie, rozvádzače, signalizácia a núdzové volanie.',
    responsibilities: [
      'Práce na riadení a elektroinštalácii zariadení',
      'Zapojenie a oživenie po oprave alebo modernizácii',
      'Spolupráca so servisnými technikmi pri diagnostike',
    ],
    requirements: [
      'Odborná spôsobilosť v elektrotechnike',
      'Vodičský preukaz skupiny B',
    ],
    niceToHave: ['Skúsenosť s riadiacimi systémami výťahov'],
    datePosted: '2026-08-28',
    validThrough: null,
  },
];

/** Podľa dotazníka: „služobné auto, školenia, zaučenie, stabilita". */
export const benefits = [
  { title: 'Služobné vozidlo', text: 'Na výjazdy k zákazníkom.' },
  { title: 'Školenia', text: 'Na konkrétne typy zariadení, s ktorými budete pracovať.' },
  { title: 'Zaučenie', text: 'Nastupujete k skúseným technikom, nie do neznáma.' },
  {
    title: 'Stabilita',
    /* Odvodené z company.stats, nie napísané natvrdo. Keby sa údaj
       v data/company.js vypol, veta sa prispôsobí — inak by tvrdenie
       zostalo na webe z druhého, needitovateľného zdroja. */
    text: [
      company.stats.yearsInBusiness ? `Firma pôsobí v odbore ${company.stats.yearsInBusiness} rokov` : null,
      company.stats.servicedLifts ? `servisuje ${company.stats.servicedLifts} zariadení` : null,
    ]
      .filter(Boolean)
      .join(' a ') || 'Zavedená firma so stabilnou zákazníckou základňou.',
  },
];

/** Klient sa k otvoreným žiadostiam nevyjadril → CTA sa nezobrazí. */
export const acceptsOpenApplications = null;

/**
 * Smie sa pozícia zverejniť ako pracovný inzerát?
 *
 * § 62 ods. 2 zákona č. 5/2004 Z. z. vyžaduje pri inzeráte uviesť sumu
 * základnej zložky mzdy. Kým ju klient nedodá, pozície sa NEZOBRAZUJÚ
 * ako otvorené inzeráty — stránka o nich hovorí len informatívne.
 */
export const canPublishAsJobAd = positions.length > 0 && positions.every((p) => p.salaryFrom);

export const whatWePublish = [
  'Názov pozície a miesto výkonu práce',
  'Náplň práce a typ zariadení, s ktorými sa pracuje',
  'Požadovaná odbornosť a oprávnenia',
  'Forma spolupráce a rozsah úväzku',
  'Mzdové podmienky',
];
