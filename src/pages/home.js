/**
 * Domovská stránka
 *
 * Konverzný flow (§5, §6 zadania):
 *   hero → problém → služby → AKVIZÍCIA → postup → čo dostanete →
 *   segmenty → referencie → havária → kariéra → FAQ → kontakt
 *
 * Akvizičná sekcia (získanie nového výťahu do servisu) je vizuálne
 * najvýraznejší blok stránky, pretože je to najhodnotnejšia konverzia.
 */

import { esc } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import {
  trustBar,
  serviceGrid,
  acquisition,
  problemGrid,
  processSteps,
  deliverableStrip,
  segmentSection,
  referenceSection,
  emergencyCta,
  careersTeaser,
  faqSection,
  ctaBand,
  btn,
} from '../lib/components.js';
import {
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
} from '../lib/seo.js';
import { problems, processServis, deliverables } from '../../data/content.js';
import { faqHome } from '../../data/faq.js';
import { positions } from '../../data/careers.js';

export default function page(ctx) {
  const { company, serviceAreaLabel } = ctx;

  const hero = `
  <section class="hero on-dark">
    <div class="hero__bg" aria-hidden="true">
      <img src="/assets/foto/servis-rozvadzac.jpg" width="1400" height="1032"
           srcset="/assets/foto/servis-rozvadzac-760.jpg 760w, /assets/foto/servis-rozvadzac.jpg 1400w"
           sizes="100vw"
           alt="" fetchpriority="high" decoding="async">
    </div>
    <div class="container hero__inner">
      <div class="hero__content" data-reveal>
        <p class="hero__eyebrow">${icon('pin')}<span>${esc(serviceAreaLabel)}</span></p>
        <h1 class="hero__title">Servis výťahov <em>v Banskej Bystrici</em> a okolí</h1>
        <p class="hero__lead">
          Pravidelný servis, opravy, odborné prehliadky a modernizácia výťahov
          pre bytové domy, správcovské spoločnosti, firmy a inštitúcie.
          Napíšte nám, o aké zariadenie ide — ozveme sa s konkrétnou odpoveďou.
        </p>
        <div class="hero__actions">
          ${btn('Nezáväzný dopyt', '/kontakt/#dopyt', { variant: 'primary', size: 'lg', iconName: 'arrow' })}
          ${btn('Havarijná služba', '/havarijna-sluzba/', { variant: 'ghost-invert', size: 'lg' })}
        </div>
        <ul class="hero__meta">
          <li>${icon('gear')}<span>Servis a opravy</span></li>
          <li>${icon('clipboard')}<span>Prehliadky a skúšky</span></li>
          <li>${icon('upgrade')}<span>Modernizácia a rekonštrukcia</span></li>
        </ul>
      </div>
    </div>
  </section>`;

  const main = [
    hero,
    trustBar(company, serviceAreaLabel),
    problemGrid(problems, { index: '01' }),
    serviceGrid({
      index: '02',
      heading: 'Čo pre vás vieme urobiť',
      lead: 'Každá služba má vlastnú stránku s tým, čo zahŕňa, kedy ju budete potrebovať a ako prebieha.',
    }),
    acquisition({ index: '03' }),
    processSteps(processServis, {
      index: '04',
      heading: 'Ako prebieha prevzatie výťahu do servisu',
      lead: 'Od prvého kontaktu po pravidelný servis. Bez skrytých krokov.',
    }),
    deliverableStrip(deliverables),
    segmentSection({ index: '05' }),
    referenceSection({ index: '06' }),
    emergencyCta(company, { index: '07' }),
    careersTeaser(positions, { index: '08' }),
    faqSection(faqHome, { index: '09' }),
    ctaBand(company, {
      title: 'Potrebujete cenu alebo obhliadku?',
      text: 'Napíšte adresu objektu a počet výťahov. Ostatné doriešime pri obhliadke.',
    }),
  ].join('\n');

  return {
    path: '/',
    title: `Servis výťahov Banská Bystrica | ${company.legalName}`,
    description:
      'Servis, opravy, odborné prehliadky a modernizácia výťahov v Banskej Bystrici a okolí. Pre bytové domy, správcov aj firmy. Vyžiadajte si nezáväznú ponuku.',
    crumbs: null,
    bodyClass: 'page-home',
    schemas: [
      organizationSchema(company),
      localBusinessSchema(company),
      websiteSchema(company),
    ],
    main,
  };
}
