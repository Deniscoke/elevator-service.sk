/**
 * Spoločná šablóna stránky služby.
 *
 * Štruktúra je jednotná (§7 zadania), obsah dodáva každý modul služby zvlášť:
 *   1. H1 + krátke vysvetlenie
 *   2. kedy zákazník službu potrebuje
 *   3. čo služba zahŕňa
 *   4. ako spolupráca prebieha
 *   5. pre koho je určená
 *   6. FAQ
 *   7. CTA
 *
 * Vďaka tomu je oprava štruktúry jedna zmena, nie päť.
 */

import { esc, isSet, when, map } from './html.js';
import { icon } from './icons.js';
import {
  sectionHead,
  processSteps,
  faqSection,
  ctaBand,
  relatedServices,
  btn,
} from './components.js';
import { serviceSchema, breadcrumbSchema, faqSchema, organizationSchema } from './seo.js';

/**
 * @param {object} spec
 * @param {object} spec.service   záznam z data/services.js
 * @param {string} spec.lead      podnadpis pod H1
 * @param {string[]} spec.intro   odseky úvodného textu
 * @param {object[]} spec.signals „kedy to budete potrebovať"
 * @param {object[]} spec.includes „čo služba zahŕňa"
 * @param {object[]} spec.process kroky spolupráce
 * @param {object} spec.audience  { title, items }
 * @param {object[]} spec.faq     otázky a odpovede
 * @param {object} [spec.aside]   bočný box (napr. čo si pripraviť k dopytu)
 * @param {string} [spec.extraSection] ľubovoľný HTML blok navyše
 * @param {string} [spec.ctaTitle]
 */
export function buildServicePage(ctx, spec) {
  const { company, serviceAreaLabel } = ctx;
  const s = spec.service;

  const crumbs = [
    { label: 'Domov', path: '/' },
    { label: s.navLabel, path: s.path },
  ];

  const pageHero = `
  <section class="page-hero${spec.heroVariant ? ' page-hero--' + esc(spec.heroVariant) : ''}">
    <div class="container">
      <div class="page-hero__inner">
        <p class="eyebrow${spec.heroVariant === 'emergency' ? ' eyebrow--danger' : ''}">
          <span class="eyebrow__num">${esc(s.icon === 'alert' ? '!' : '01')}</span>${esc(s.navLabel)}
        </p>
        <h1 class="page-hero__title">${esc(s.h1)}</h1>
        <p class="page-hero__lead">${esc(spec.lead)}</p>
        <div class="page-hero__actions">
          ${btn(spec.primaryCtaLabel || 'Nezáväzný dopyt', `/kontakt/?typ=${encodeURIComponent(spec.inquiryType || '')}#dopyt`, {
            variant: 'primary',
            size: 'lg',
            iconName: 'arrow',
          })}
          ${when(spec.secondaryCta, () =>
            btn(spec.secondaryCta.label, spec.secondaryCta.href, {
              variant: spec.heroVariant === 'emergency' ? 'ghost-invert' : 'secondary',
              size: 'lg',
            })
          )}
        </div>
      </div>
    </div>
  </section>`;

  /* ---- úvodný text + bočný box ------------------------------------ */
  const introBlock = `
  <section class="section section--tight">
    <div class="container">
      <div class="split">
        <div class="prose">
          ${map(spec.intro, (p) => `<p>${p}</p>`)}
        </div>
        ${when(
          isSet(spec.aside),
          () => `
        <aside class="split__aside" data-reveal>
          <div class="aside-box">
            <p class="aside-box__title">${esc(spec.aside.title)}</p>
            <ul class="aside-box__list">
              ${map(spec.aside.items, (i) => `<li>${esc(i)}</li>`)}
            </ul>
            ${when(spec.aside.cta !== false, () =>
              btn('Napísať dopyt', `/kontakt/?typ=${encodeURIComponent(spec.inquiryType || '')}#dopyt`, {
                variant: 'secondary',
                block: true,
              })
            )}
          </div>
        </aside>`
        )}
      </div>
    </div>
  </section>`;

  /* ---- kedy to budete potrebovať ---------------------------------- */
  const signalsBlock = `
  <section class="section section--alt" id="kedy">
    <div class="container">
      ${sectionHead({
        index: '02',
        eyebrow: 'Kedy to riešiť',
        title: esc(spec.signalsTitle || 'Kedy budete túto službu potrebovať'),
      })}
      <ul class="card-grid card-grid--problems">
        ${map(
          spec.signals,
          (it) => `
        <li class="card card--problem" data-reveal="stagger">
          <h3 class="card__title card__title--sm">${esc(it.title)}</h3>
          <p class="card__text">${esc(it.text)}</p>
        </li>`
        )}
      </ul>
    </div>
  </section>`;

  /* ---- čo služba zahŕňa -------------------------------------------- */
  const includesBlock = `
  <section class="section" id="rozsah">
    <div class="container">
      ${sectionHead({
        index: '03',
        eyebrow: 'Rozsah',
        title: esc(spec.includesTitle || 'Čo služba zahŕňa'),
        lead: spec.includesLead || null,
      })}
      <ul class="deliverables">
        ${map(
          spec.includes,
          (it) => `
        <li class="deliverables__item" data-reveal="stagger">
          <span class="deliverables__tick" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m3 8.5 3.5 3.5L13 5" stroke="currentColor" stroke-width="1.8"/></svg>
          </span>
          <span>
            <strong class="deliverables__title">${esc(it.title)}</strong>
            <span class="deliverables__text">${esc(it.text)}</span>
          </span>
        </li>`
        )}
      </ul>
    </div>
  </section>`;

  /* ---- pre koho ----------------------------------------------------- */
  const audienceBlock = when(
    isSet(spec.audience),
    () => `
  <section class="section section--alt" id="pre-koho">
    <div class="container">
      ${sectionHead({
        index: '05',
        eyebrow: 'Pre koho',
        title: esc(spec.audience.title || 'Pre koho je služba určená'),
      })}
      <ul class="segments">
        ${map(
          spec.audience.items,
          (a) => `
        <li class="segments__item" data-reveal="stagger">
          <h3 class="segments__title">${esc(a.title)}</h3>
          <p class="segments__text">${esc(a.text)}</p>
        </li>`
        )}
      </ul>
    </div>
  </section>`
  );

  const main = [
    pageHero,
    introBlock,
    signalsBlock,
    includesBlock,
    processSteps(spec.process, {
      index: '04',
      heading: spec.processTitle || 'Ako spolupráca prebieha',
      id: 'ako-to-prebieha',
    }),
    spec.extraSection || '',
    audienceBlock,
    faqSection(spec.faq, { index: '06', heading: 'Časté otázky' }),
    relatedServices(s.id),
    ctaBand(company, {
      title: spec.ctaTitle || 'Chcete cenu alebo obhliadku?',
      text: spec.ctaText || 'Napíšte nám adresu objektu a typ zariadenia. Ozveme sa s konkrétnou odpoveďou.',
      primaryHref: `/kontakt/?typ=${encodeURIComponent(spec.inquiryType || '')}#dopyt`,
    }),
  ].join('\n');

  const floors = [
    { num: '02', id: 'kedy',            label: 'Kedy to riešiť' },
    { num: '03', id: 'rozsah',          label: 'Rozsah' },
    { num: '04', id: 'ako-to-prebieha', label: 'Postup' },
    { num: '05', id: 'pre-koho',        label: 'Pre koho' },
    { num: '06', id: 'faq',             label: 'Otázky' },
  ];

  return {
    path: s.path,
    floors,
    title: s.metaTitle,
    description: s.metaDescription,
    crumbs,
    bodyClass: `page-service page-service--${s.id}`,
    schemas: [
      organizationSchema(company),
      serviceSchema(company, s),
      breadcrumbSchema(company, crumbs),
      faqSchema(spec.faq),
    ],
    main,
  };
}
