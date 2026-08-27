/**
 * /o-nas/
 *
 * Stránka je postavená tak, aby fungovala aj bez firemných čísel.
 * Bloky s údajmi (roky na trhu, počet zariadení, oprávnenia, značky)
 * sa vykreslia až vtedy, keď dáta naozaj existujú.
 * Do tej doby stránka hovorí o tom, čo firma robí a ako — nie o tom,
 * aká je skvelá.
 */

import { esc, isSet, when, map } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import {
  sectionHead,
  trustBar,
  deliverableStrip,
  segmentSection,
  ctaBand,
  btn,
} from '../lib/components.js';
import { organizationSchema, localBusinessSchema, breadcrumbSchema } from '../lib/seo.js';
import { deliverables } from '../../data/content.js';
import { services } from '../../data/services.js';

export default function page(ctx) {
  const { company, serviceAreaLabel } = ctx;

  const crumbs = [
    { label: 'Domov', path: '/' },
    { label: 'O nás', path: '/o-nas/' },
  ];

  const pageHero = `
  <section class="page-hero">
    <div class="container">
      <div class="page-hero__inner">
        <p class="eyebrow"><span class="eyebrow__num">01</span>O nás</p>
        <h1 class="page-hero__title">${esc(company.legalName)}</h1>
        <p class="page-hero__lead">
          Staráme sa o výťahy — od pravidelného servisu cez opravy a odborné prehliadky
          až po modernizáciu. Pôsobíme v regióne ${esc(serviceAreaLabel)}.
        </p>
      </div>
    </div>
  </section>`;

  const introBlock = `
  <section class="section section--tight">
    <div class="container">
      <div class="split">
        <div class="prose">
          <h2>Čím sa zaoberáme</h2>
          <p>
            Výťah je zariadenie, ktoré si všimnete až vtedy, keď nefunguje. Naša práca je
            postarať sa o to, aby ten moment prišiel čo najmenej často — a keď príde,
            aby sa riešil rýchlo a s poriadkom v dokumentácii.
          </p>
          <p>
            Pracujeme pre bytové domy a spoločenstvá vlastníkov, správcovské spoločnosti,
            firmy, školy a inštitúcie. Rozsah servisu prispôsobujeme typu objektu,
            veku zariadenia a tomu, ako intenzívne sa používa.
          </p>

          <h2>Ako pristupujeme k práci</h2>
          <p>
            Neposielame ponuky bez toho, aby sme videli zariadenie. Pri obhliadke prejdeme
            výťah aj jeho dokumentáciu, a až potom hovoríme o rozsahu a cene. Ak niečo
            neodporúčame, povieme to — vrátane situácií, keď sa oprava prestáva oplácať
            a rozumnejšia je modernizácia.
          </p>
          <p>
            Z každého úkonu je zápis. Nie preto, že to tak treba, ale preto, že bez neho
            po roku nikto nevie, čo sa na zariadení dialo.
          </p>
        </div>

        <aside class="split__aside" data-reveal>
          <div class="aside-box">
            <p class="aside-box__title">Čo robíme</p>
            <ul class="aside-box__list">
              ${map(services, (s) => `<li><a href="${esc(s.path)}">${esc(s.cardTitle)}</a></li>`)}
            </ul>
            ${btn('Nezáväzný dopyt', '/kontakt/#dopyt', { variant: 'secondary', block: true })}
          </div>
        </aside>
      </div>
    </div>
  </section>`;

  /* ---- odborné oprávnenia — len ak sú v dátach --------------------- */
  const certBlock = when(
    isSet(company.certifications),
    () => `
  <section class="section section--alt">
    <div class="container">
      ${sectionHead({ index: '03', eyebrow: 'Odbornosť', title: 'Odborné oprávnenia' })}
      <ul class="segments">
        ${map(
          company.certifications,
          (c) => `
        <li class="segments__item">
          <h3 class="segments__title">${esc(c.name)}</h3>
          <p class="segments__text">${esc([c.issuer, c.number].filter(Boolean).join(' · '))}</p>
        </li>`
        )}
      </ul>
    </div>
  </section>`
  );

  /* ---- typy zariadení a značky — len ak sú v dátach ---------------- */
  const equipmentBlock = when(
    isSet(company.equipmentTypes) || isSet(company.brands),
    () => `
  <section class="section">
    <div class="container">
      ${sectionHead({ index: '04', eyebrow: 'Zariadenia', title: 'S čím pracujeme' })}
      <div class="split">
        ${when(
          isSet(company.equipmentTypes),
          () => `
        <div class="prose">
          <h3>Typy zariadení</h3>
          <ul>${map(company.equipmentTypes, (t) => `<li>${esc(t)}</li>`)}</ul>
        </div>`
        )}
        ${when(
          isSet(company.brands),
          () => `
        <div class="prose">
          <h3>Značky výťahov</h3>
          <ul>${map(company.brands, (b) => `<li>${esc(b)}</li>`)}</ul>
        </div>`
        )}
      </div>
    </div>
  </section>`
  );

  const main = [
    pageHero,
    trustBar(company, serviceAreaLabel),
    introBlock,
    `<section class="section section--tight section--alt">
      <div class="container">
        ${sectionHead({ index: '02', eyebrow: 'Spolupráca', title: 'Čo od nás dostanete' })}
      </div>
      ${deliverableStrip(deliverables)}
    </section>`,
    certBlock,
    equipmentBlock,
    segmentSection({ index: '05' }),
    ctaBand(company, {
      title: 'Chcete sa o nás dozvedieť viac?',
      text: 'Najlepšie sa to zistí pri obhliadke. Napíšte nám a dohodneme termín.',
    }),
  ].join('\n');

  return {
    path: '/o-nas/',
    title: `O nás | ${company.legalName}`,
    description: `${company.legalName} — servis, opravy, odborné prehliadky a modernizácia výťahov v Banskej Bystrici a okolí. Zistite, ako pracujeme a pre koho.`,
    crumbs,
    bodyClass: 'page-about',
    schemas: [
      organizationSchema(company),
      localBusinessSchema(company),
      breadcrumbSchema(company, crumbs),
    ],
    main,
  };
}
