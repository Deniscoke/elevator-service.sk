/**
 * /referencie/
 *
 * Kým nemáme reálne realizácie so súhlasom zákazníkov, stránka NEZOBRAZUJE
 * žiadne „ukážkové" referencie. Namiesto toho robí to, čo v tejto fáze
 * naozaj funguje: vysvetlí, aké typy prác robíme a ponúkne referenciu
 * na vyžiadanie pre konkrétny typ objektu.
 *
 * Po doplnení data/references.js sa výpis zapne automaticky.
 */

import { esc, isSet, map } from '../lib/html.js';
import { sectionHead, referenceSection, segmentSection, ctaBand, btn } from '../lib/components.js';
import { organizationSchema, breadcrumbSchema } from '../lib/seo.js';
import { references } from '../../data/references.js';
import { services } from '../../data/services.js';

export default function page(ctx) {
  const { company } = ctx;
  const hasReferences = isSet(references.filter((r) => r.consent));

  const crumbs = [
    { label: 'Domov', path: '/' },
    { label: 'Referencie', path: '/referencie/' },
  ];

  const pageHero = `
  <section class="page-hero">
    <div class="container">
      <div class="page-hero__inner">
        <p class="eyebrow"><span class="eyebrow__num">01</span>Referencie</p>
        <h1 class="page-hero__title">Realizácie a referencie</h1>
        <p class="page-hero__lead">
          ${
            hasReferences
              ? 'Vybrané práce na zariadeniach, ktoré máme v starostlivosti alebo sme na nich robili obnovu.'
              : 'Realizácie zverejňujeme len so súhlasom zákazníkov, ktorých sa týkajú. Ak potrebujete referenciu na objekt podobný tomu vášmu, pošleme vám ju priamo.'
          }
        </p>
        <div class="page-hero__actions">
          ${btn('Vyžiadať referenciu', '/kontakt/#dopyt', { variant: 'primary', size: 'lg', iconName: 'arrow' })}
        </div>
      </div>
    </div>
  </section>`;

  /* Typy prác — dáva stránke hodnotu aj bez konkrétnych realizácií
     a zároveň prelinkováva na stránky služieb. */
  const workTypes = `
  <section class="section">
    <div class="container">
      ${sectionHead({
        index: '02',
        eyebrow: 'Typy prác',
        title: 'Na akých prácach nás nájdete',
        lead: 'Každý typ práce má vlastnú stránku s popisom priebehu a rozsahu.',
      })}
      <ul class="card-grid card-grid--problems">
        ${map(
          services.filter((s) => !s.isEmergency),
          (s) => `
        <li class="card card--problem" data-reveal="stagger">
          <h3 class="card__title card__title--sm">${esc(s.cardTitle)}</h3>
          <p class="card__text">${esc(s.summary)}</p>
          <a class="card__inline-link" href="${esc(s.path)}">Detail služby</a>
        </li>`
        )}
      </ul>
    </div>
  </section>`;

  const main = [
    pageHero,
    referenceSection({ index: '03', limit: 12, showEmptyState: true }),
    workTypes,
    segmentSection({ index: '04' }),
    ctaBand(company, {
      title: 'Potrebujete referenciu na konkrétny typ objektu?',
      text: 'Napíšte nám, o aký objekt a zariadenie ide. Pošleme relevantnú referenciu.',
    }),
  ].join('\n');

  return {
    path: '/referencie/',
    title: `Referencie | ${company.legalName}`,
    description:
      'Realizácie a referencie na servis, opravy a modernizáciu výťahov v Banskej Bystrici a okolí. Referenciu na konkrétny typ objektu pošleme na vyžiadanie.',
    crumbs,
    bodyClass: 'page-references',
    schemas: [organizationSchema(company), breadcrumbSchema(company, crumbs)],
    main,
  };
}
