/**
 * /kariera/
 *
 * ⚠ Zámerne strohá stránka.
 * Nemáme potvrdené pracovné pozície, mzdy ani benefity, takže si ich
 * nevymýšľame. Stránka preto:
 *   - povie pravdivý stav (žiadna otvorená pozícia),
 *   - ukáže, čo o pozícii zverejníme, keď ju otvoríme,
 *   - a existuje ako indexovateľná URL, aby bola pripravená vopred.
 *
 * Po doplnení data/careers.js sa výpis pozícií a JobPosting schéma
 * zapnú automaticky.
 */

import { esc, isSet, when, map } from '../lib/html.js';
import { sectionHead, ctaBand, btn } from '../lib/components.js';
import { inquiryForm } from '../lib/form.js';
import { organizationSchema, breadcrumbSchema } from '../lib/seo.js';
import { positions, benefits, acceptsOpenApplications, whatWePublish } from '../../data/careers.js';

export default function page(ctx) {
  const { company } = ctx;
  const open = isSet(positions);

  const crumbs = [
    { label: 'Domov', path: '/' },
    { label: 'Kariéra', path: '/kariera/' },
  ];

  const pageHero = `
  <section class="page-hero">
    <div class="container">
      <div class="page-hero__inner">
        <p class="eyebrow"><span class="eyebrow__num">01</span>Kariéra</p>
        <h1 class="page-hero__title">Práca v ${esc(company.legalName)}</h1>
        <p class="page-hero__lead">
          ${
            open
              ? 'Aktuálne obsadzujeme pozície uvedené nižšie.'
              : 'Momentálne nemáme zverejnenú žiadnu voľnú pozíciu. Keď sa to zmení, nájdete ju tu.'
          }
        </p>
        ${when(
          open,
          () => `<div class="page-hero__actions">${btn('Pozrieť pozície', '#pozicie', {
            variant: 'primary',
            size: 'lg',
            iconName: 'arrow',
          })}</div>`
        )}
      </div>
    </div>
  </section>`;

  /* ---- otvorené pozície — len ak existujú ------------------------- */
  const positionsBlock = when(
    open,
    () => `
  <section class="section" id="pozicie">
    <div class="container">
      ${sectionHead({ index: '02', eyebrow: 'Voľné pozície', title: 'Otvorené pozície' })}
      <ul class="card-grid card-grid--problems">
        ${map(
          positions,
          (p) => `
        <li class="card card--problem" data-reveal="stagger">
          <p class="card__meta">${esc(p.location || '')}</p>
          <h3 class="card__title card__title--sm">${esc(p.title)}</h3>
          <p class="card__text">${esc(p.summary || '')}</p>
        </li>`
        )}
      </ul>
    </div>
  </section>`
  );

  /* ---- prázdny stav — čo zverejníme ------------------------------- */
  const emptyBlock = when(
    !open,
    () => `
  <section class="section">
    <div class="container container--narrow">
      ${sectionHead({
        index: '02',
        eyebrow: 'Ako to bude vyzerať',
        title: 'Čo o pozícii zverejníme',
        lead: 'Aby ste sa vedeli rozhodnúť skôr, než niekomu zavoláte.',
      })}
      <div class="prose">
        <ul>
          ${map(whatWePublish, (w) => `<li>${esc(w)}</li>`)}
        </ul>
      </div>
    </div>
  </section>`
  );

  /* ---- benefity — len ak sú potvrdené ----------------------------- */
  const benefitsBlock = when(
    isSet(benefits),
    () => `
  <section class="section section--alt">
    <div class="container">
      ${sectionHead({ index: '03', eyebrow: 'Podmienky', title: 'Čo ponúkame' })}
      <ul class="segments">
        ${map(benefits, (b) => `<li class="segments__item"><h3 class="segments__title">${esc(b.title)}</h3><p class="segments__text">${esc(b.text || '')}</p></li>`)}
      </ul>
    </div>
  </section>`
  );

  /* ---- otvorené žiadosti — len ak to firma potvrdila -------------- */
  const openApplicationBlock = when(
    acceptsOpenApplications === true,
    () => `
  <section class="section section--alt" id="ozvite-sa">
    <div class="container container--narrow">
      ${sectionHead({
        index: '04',
        eyebrow: 'Otvorená žiadosť',
        title: 'Nenašli ste vhodnú pozíciu?',
        lead: 'Ozvite sa aj tak. Ak nás oslovíte, ozveme sa, keď sa niečo otvorí.',
      })}
      ${inquiryForm(company, { context: 'kariera' })}
    </div>
  </section>`
  );

  const main = [
    pageHero,
    positionsBlock,
    emptyBlock,
    benefitsBlock,
    openApplicationBlock,
    ctaBand(company, {
      title: 'Máte otázku k práci u nás?',
      text: 'Napíšte nám. Odpovieme aj vtedy, keď práve žiadnu pozíciu neobsadzujeme.',
      primaryLabel: 'Napísať správu',
    }),
  ].join('\n');

  return {
    path: '/kariera/',
    title: `Kariéra | ${company.legalName}`,
    description: open
      ? `Voľné pracovné pozície v ${company.legalName} — servis výťahov, Banská Bystrica a okolie.`
      : `Kariéra v ${company.legalName}. Aktuálne nemáme zverejnenú voľnú pozíciu — pozrite si, čo zverejníme, keď ju otvoríme.`,
    crumbs,
    bodyClass: 'page-careers',
    schemas: [organizationSchema(company), breadcrumbSchema(company, crumbs)],
    main,
    // Formulár je na stránke len pri otvorených žiadostiach.
    extraScripts: acceptsOpenApplications === true ? '  <script src="/js/form.js" defer></script>' : '',
  };
}
