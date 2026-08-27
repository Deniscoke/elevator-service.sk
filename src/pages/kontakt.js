/**
 * /kontakt/
 *
 * Hlavná konverzná stránka. Dopytový formulár je navrhnutý tak,
 * aby z neho firma dostala použiteľný dopyt — nie len „ozvite sa mi".
 *
 * Kontaktná karta sa vykreslí len z reálnych údajov. Ak nie je k dispozícii
 * ani telefón, ani e-mail, ani adresa, karta sa nezobrazí vôbec
 * a stránka sa sústredí na formulár.
 */

import { esc, isSet, when, map, telHref } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { sectionHead, btn } from '../lib/components.js';
import { inquiryForm } from '../lib/form.js';
import {
  organizationSchema,
  localBusinessSchema,
  breadcrumbSchema,
} from '../lib/seo.js';
import { serviceArea } from '../../data/locations.js';

export default function page(ctx) {
  const { company, serviceAreaLabel } = ctx;

  const crumbs = [
    { label: 'Domov', path: '/' },
    { label: 'Kontakt', path: '/kontakt/' },
  ];

  const phone = telHref(company.contact.phone);
  const emergency = telHref(company.contact.emergencyPhone);
  const hasAddress = isSet(company.address.street);
  const hasAnyContact = Boolean(phone || isSet(company.contact.email) || hasAddress);

  const contactItems = [
    phone && {
      icon: 'phone',
      label: company.contact.phoneNote || 'Telefón',
      value: company.contact.phone,
      href: phone,
    },
    company.emergency.enabled && emergency && {
      icon: 'alert',
      label: company.emergency.hoursLabel || 'Havarijná linka',
      value: company.contact.emergencyPhone,
      href: emergency,
    },
    isSet(company.contact.email) && {
      icon: 'mail',
      label: 'E-mail',
      value: company.contact.email,
      href: 'mailto:' + company.contact.email,
    },
    hasAddress && {
      icon: 'pin',
      label: 'Adresa',
      value: [company.address.street, [company.address.postalCode, company.address.city].filter(Boolean).join(' ')]
        .filter(Boolean)
        .join(', '),
      href: company.address.mapUrl || null,
    },
  ].filter(Boolean);

  const pageHero = `
  <section class="page-hero">
    <div class="container">
      <div class="page-hero__inner">
        <p class="eyebrow"><span class="eyebrow__num">01</span>Kontakt</p>
        <h1 class="page-hero__title">Napíšte nám dopyt</h1>
        <p class="page-hero__lead">
          Čím konkrétnejšie napíšete, o aké zariadenie a objekt ide, tým presnejšiu
          odpoveď dostanete späť. Dopyt je nezáväzný.
        </p>
      </div>
    </div>
  </section>`;

  const contactCard = when(
    hasAnyContact,
    () => `
        <aside class="contact-card" data-reveal>
          <h2 class="contact-card__title">Priamy kontakt</h2>
          <ul class="contact-list">
            ${map(
              contactItems,
              (c) => `
            <li class="contact-list__item">
              <span class="contact-list__icon">${icon(c.icon)}</span>
              <span>
                <span class="contact-list__label">${esc(c.label)}</span>
                ${
                  c.href
                    ? `<a class="contact-list__value" href="${esc(c.href)}">${esc(c.value)}</a>`
                    : `<span class="contact-list__value">${esc(c.value)}</span>`
                }
              </span>
            </li>`
            )}
          </ul>
        </aside>`
  );

  /* Ak nemáme priamy kontakt, aspoň povieme, čo sa s dopytom stane
     a kde pôsobíme. To je pravdivá a užitočná informácia. */
  const areaCard = when(
    !hasAnyContact,
    () => `
        <aside class="contact-card" data-reveal>
          <h2 class="contact-card__title">Kde pôsobíme</h2>
          <ul class="contact-list">
            <li class="contact-list__item">
              <span class="contact-list__icon">${icon('pin')}</span>
              <span>
                <span class="contact-list__label">Servisná oblasť</span>
                <span class="contact-list__value">${esc(serviceAreaLabel)}</span>
              </span>
            </li>
          </ul>
          <div class="prose">
            <h3>Čo bude nasledovať</h3>
            <ol>
              <li>Ozveme sa na kontakt, ktorý uvediete.</li>
              <li>Dohodneme obhliadku zariadenia.</li>
              <li>Dostanete ponuku s rozsahom aj cenou.</li>
            </ol>
          </div>
          ${when(
            !serviceArea.confirmed,
            () => `<p class="text-muted" style="font-size:var(--text-sm)">
            Ak je váš objekt mimo Banskej Bystrice, napíšte nám aj tak — dostupnosť
            posúdime podľa konkrétnej lokality.
          </p>`
          )}
        </aside>`
  );

  const formSection = `
  <section class="section" id="dopyt">
    <div class="container">
      <div class="contact-layout">
        <div>
          ${sectionHead({
            index: '02',
            eyebrow: 'Dopytový formulár',
            title: 'Povedzte nám o zariadení',
            lead: 'Vyplnenie zaberie približne minútu.',
          })}
          ${inquiryForm(company, { context: 'dopyt' })}
        </div>
        ${contactCard}${areaCard}
      </div>
    </div>
  </section>`;

  const emergencyStrip = `
  <section class="section section--tight section--emergency">
    <div class="container">
      <div class="emergency emergency--compact">
        <div class="emergency__content">
          <p class="eyebrow eyebrow--danger"><span class="eyebrow__num">03</span>Havária</p>
          <h2 class="emergency__title">Uviazol niekto vo výťahu?</h2>
          <p class="emergency__lead">
            Formulár nie je vhodný na riešenie havárie. Postup pri uviaznutí vo výťahu
            nájdete na samostatnej stránke.
          </p>
          <div class="emergency__actions">
            ${
              company.emergency.enabled && emergency
                ? `<a class="btn btn--emergency btn--lg" href="${esc(emergency)}">${icon('phone')}<span>${esc(
                    company.contact.emergencyPhone
                  )}</span></a>`
                : btn('Postup pri uviaznutí', '/havarijna-sluzba/', {
                    variant: 'emergency',
                    size: 'lg',
                    iconName: 'arrow',
                  })
            }
          </div>
        </div>
        <div class="emergency__stripe" aria-hidden="true"></div>
      </div>
    </div>
  </section>`;

  return {
    path: '/kontakt/',
    title: `Kontakt | ${company.legalName}`,
    description:
      'Napíšte nám dopyt na servis, opravu, odbornú prehliadku alebo modernizáciu výťahu. Banská Bystrica a okolie. Dopyt je nezáväzný.',
    crumbs,
    bodyClass: 'page-contact',
    schemas: [
      organizationSchema(company),
      localBusinessSchema(company),
      breadcrumbSchema(company, crumbs),
    ],
    main: [pageHero, formSection, emergencyStrip].join('\n'),
    extraScripts: '  <script src="/js/form.js" defer></script>',
  };
}
