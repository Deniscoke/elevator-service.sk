/**
 * /poradna/
 *
 * Zámerne tu NIE SÚ vygenerované AI články. Poradňa má vzniknúť z otázok,
 * ktoré firma reálne dostáva, a z technicky overených faktov.
 *
 * Aby stránka nebola prázdna, robí dve veci, ktoré majú hodnotu už teraz:
 *   1. ukazuje témy, ktoré bude pokrývať (a odkazuje na príslušnú službu),
 *   2. je rozcestníkom k otázkam, ktoré sú už zodpovedané na stránkach služieb.
 *
 * Po pridaní článku do data/articles.js sa výpis, sitemap aj prelinkovanie
 * zapnú automaticky.
 */

import { esc, isSet, when, map } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { sectionHead, ctaBand, btn } from '../lib/components.js';
import { organizationSchema, breadcrumbSchema } from '../lib/seo.js';
import { publishedArticles, plannedTopics } from '../../data/articles.js';
import { serviceById } from '../../data/services.js';
import { faq } from '../../data/faq.js';

/* Rozcestník otázok — otázka odkazuje tam, kde je odpoveď.
   Text odpovede sa tu ZÁMERNE neopakuje, aby nevznikal duplicitný obsah. */
const questionIndex = [
  { group: 'Servis', serviceId: 'servis', items: faq.servis },
  { group: 'Opravy', serviceId: 'opravy', items: faq.opravy },
  { group: 'Prehliadky a skúšky', serviceId: 'prehliadky', items: faq.prehliadky },
  { group: 'Modernizácia', serviceId: 'modernizacia', items: faq.modernizacia },
  { group: 'Havária', serviceId: 'havaria', items: faq.havaria },
];

export default function page(ctx) {
  const { company } = ctx;
  const hasArticles = isSet(publishedArticles);

  const crumbs = [
    { label: 'Domov', path: '/' },
    { label: 'Poradňa', path: '/poradna/' },
  ];

  const pageHero = `
  <section class="page-hero">
    <div class="container">
      <div class="page-hero__inner">
        <p class="eyebrow"><span class="eyebrow__num">01</span>Poradňa</p>
        <h1 class="page-hero__title">Poradňa o výťahoch</h1>
        <p class="page-hero__lead">
          Praktické odpovede na otázky, ktoré dostávame od správcov, spoločenstiev
          vlastníkov a majiteľov objektov.
        </p>
      </div>
    </div>
  </section>`;

  /* ---- publikované články — zatiaľ prázdne ------------------------ */
  const articlesBlock = when(
    hasArticles,
    () => `
  <section class="section">
    <div class="container">
      ${sectionHead({ index: '02', eyebrow: 'Články', title: 'Najnovšie z poradne' })}
      <ul class="card-grid card-grid--problems">
        ${map(
          publishedArticles,
          (a) => `
        <li class="card card--problem" data-reveal="stagger">
          <p class="card__meta">${esc(a.published)}</p>
          <h3 class="card__title card__title--sm">
            <a class="card__link" href="/poradna/${esc(a.slug)}/">${esc(a.title)}</a>
          </h3>
          <p class="card__text">${esc(a.perex)}</p>
        </li>`
        )}
      </ul>
    </div>
  </section>`
  );

  /* ---- rozcestník otázok ------------------------------------------ */
  const questionsBlock = `
  <section class="section">
    <div class="container">
      ${sectionHead({
        index: '02',
        eyebrow: 'Otázky a odpovede',
        title: 'Na čo sa nás pýtate najčastejšie',
        lead: 'Odpoveď nájdete na stránke služby, ktorej sa otázka týka.',
      })}
      <div class="qa-index">
        ${map(questionIndex, (g) => {
          const svc = serviceById[g.serviceId];
          if (!svc) return '';
          return `
        <div class="qa-index__group" data-reveal="stagger">
          <h3 class="qa-index__title">
            <span class="qa-index__icon">${icon(svc.icon)}</span>${esc(g.group)}
          </h3>
          <ul class="qa-index__list">
            ${map(g.items, (q) => `<li><a href="${esc(svc.path)}#faq">${esc(q.q)}</a></li>`)}
          </ul>
          <a class="card__inline-link" href="${esc(svc.path)}">${esc(svc.cardTitle)} ${icon('arrow')}</a>
        </div>`;
        })}
      </div>
    </div>
  </section>`;

  /* ---- plánované témy --------------------------------------------- */
  const topicsBlock = `
  <section class="section section--alt">
    <div class="container">
      ${sectionHead({
        index: '03',
        eyebrow: 'Pripravujeme',
        title: 'Témy, ktoré poradňa pokryje',
        lead: 'Obsah píšeme podľa toho, na čo sa nás ľudia naozaj pýtajú — nie podľa toho, čo sa dobre vyhľadáva.',
      })}
      <ul class="card-grid card-grid--problems">
        ${map(plannedTopics, (t) => {
          const svc = serviceById[t.serviceId];
          return `
        <li class="card card--problem" data-reveal="stagger">
          <h3 class="card__title card__title--sm">${esc(t.title)}</h3>
          <p class="card__text">${esc(t.text)}</p>
          ${svc ? `<a class="card__inline-link" href="${esc(svc.path)}">${esc(svc.cardTitle)} ${icon('arrow')}</a>` : ''}
        </li>`;
        })}
      </ul>
    </div>
  </section>`;

  const main = [
    pageHero,
    articlesBlock,
    questionsBlock,
    topicsBlock,
    ctaBand(company, {
      title: 'Nenašli ste odpoveď?',
      text: 'Napíšte nám otázku. Ak sa opakuje, spracujeme ju do poradne.',
      primaryLabel: 'Položiť otázku',
    }),
  ].join('\n');

  return {
    path: '/poradna/',
    title: `Poradňa o výťahoch | ${company.legalName}`,
    description:
      'Praktické odpovede na otázky o servise výťahov, odborných prehliadkach, poruchách a modernizácii. Pre správcov, spoločenstvá vlastníkov a majiteľov objektov.',
    crumbs,
    bodyClass: 'page-guide',
    schemas: [organizationSchema(company), breadcrumbSchema(company, crumbs)],
    main,
  };
}
