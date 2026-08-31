/**
 * /havarijna-sluzba/
 * Cieľové témy: havarijný servis výťahov, porucha výťahu, pokazený výťah
 *
 * Táto stránka má iné poradie sekcií než ostatné služby — a je to zámer.
 * Kto sem príde v núdzi, potrebuje POSTUP, nie popis služby. Preto sú
 * bezpečnostné pokyny hneď pod hlavičkou, ešte pred rozsahom služby.
 *
 * ⚠ Kým nie je potvrdené havarijné číslo a režim služby (docs/MISSING_DATA.md),
 * stránka NEZOBRAZUJE žiadny telefonický odkaz ani tvrdenie o dostupnosti.
 * Namiesto toho ponúka to, čo v danej chvíli reálne pomôže.
 */

import { esc, isSet, when, map, telHref } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { sectionHead, faqSection, relatedServices, btn, ctaBand } from '../lib/components.js';
import { serviceById } from '../../data/services.js';
import { faq } from '../../data/faq.js';
import {
  organizationSchema,
  serviceSchema,
  breadcrumbSchema,
  faqSchema,
} from '../lib/seo.js';

/* Bezpečnostné pokyny sú všeobecne platné a nezávisia od údajov klienta.
   Napriek tomu ich pred spustením webu odsúhlasí odborník — viď
   docs/EXPERT_VERIFICATION.md. */
const stepsTrapped = [
  {
    title: 'Zachovajte pokoj',
    text: 'Výťahy sú konštruované tak, aby kabína pri poruche zostala zaistená. Počkajte v kabíne a nesnažte sa dostať von.',
  },
  {
    title: 'Nepokúšajte sa dostať von sami',
    text: 'Neotvárajte dvere silou a nevystupujte z kabíny, ktorá nestojí presne v stanici. To je najrizikovejšia vec, ktorú v tejto situácii môžete urobiť.',
  },
  {
    title: 'Stlačte tlačidlo núdzového volania',
    text: 'Podržte ho dlhšie a počkajte na odozvu. Ak sa spojenie nepodarí, skúste to znova.',
  },
  {
    title: 'Nahláste, kde ste',
    text: 'Adresa objektu, vchod a ktorý výťah v poradí. Pomôže aj približné podlažie.',
  },
  {
    title: 'Počkajte na príchod technika',
    text: 'Vyslobodenie osoby z kabíny je úkon pre vyškolenú osobu alebo záchranné zložky.',
  },
];

export default function page(ctx) {
  const { company } = ctx;
  const s = serviceById.havaria;
  const tel = telHref(company.contact.emergencyPhone);
  const liveLine = company.emergency.enabled && tel;

  const crumbs = [
    { label: 'Domov', path: '/' },
    { label: 'Havarijná služba', path: s.path },
  ];

  const pageHero = `
  <section class="page-hero page-hero--emergency">
    <div class="container">
      <div class="page-hero__inner">
        <p class="eyebrow"><span class="eyebrow__num">!</span>Havarijná služba</p>
        <h1 class="page-hero__title">${esc(s.h1)}</h1>
        <p class="page-hero__lead">
          ${
            liveLine
              ? 'Pri uviaznutí osoby v kabíne alebo pri nebezpečnom stave zariadenia volajte havarijnú linku.'
              : 'Ak ste uviazli vo výťahu, nepokúšajte sa opustiť kabínu sami. Nižšie nájdete, čo urobiť ako prvé.'
          }
        </p>
        <div class="page-hero__actions">
          ${
            liveLine
              ? `<a class="btn btn--emergency btn--lg" href="${esc(tel)}">${icon('phone')}<span>${esc(
                  company.contact.emergencyPhone
                )}</span></a>
             ${btn('Čo robiť pri uviaznutí', '#postup', { variant: 'ghost-invert', size: 'lg' })}`
              : `${btn('Čo robiť pri uviaznutí', '#postup', {
                  variant: 'emergency',
                  size: 'lg',
                  iconName: 'arrow',
                })}
             ${btn('Nahlásiť poruchu', '/kontakt/?typ=oprava#dopyt', { variant: 'ghost-invert', size: 'lg' })}`
          }
        </div>
        ${when(
          liveLine && isSet(company.emergency.hoursLabel),
          () => `<p class="text-mono mt-lg text-muted">${esc(company.emergency.hoursLabel)}</p>`
        )}
      </div>
    </div>
  </section>`;

  const trappedBlock = `
  <section class="section" id="postup">
    <div class="container container--narrow">
      ${sectionHead({
        index: '01',
        eyebrow: 'Postup',
        title: 'Uviazli ste vo výťahu? Čo robiť',
      })}
      <div class="callout callout--danger">
        <p class="callout__title">Neotvárajte dvere a nevystupujte z kabíny</p>
        <p>
          Pokus opustiť kabínu, ktorá nestojí presne v stanici, je najčastejšou príčinou
          vážnych úrazov pri poruche výťahu. Počkajte na osobu, ktorá je na vyslobodenie vyškolená.
        </p>
      </div>
      <ol class="steps mt-xl">
        ${map(
          stepsTrapped,
          (st, i) => `
        <li class="steps__item" data-reveal="stagger">
          <span class="steps__num">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="steps__title">${esc(st.title)}</h3>
          <p class="steps__text">${esc(st.text)}</p>
        </li>`
        )}
      </ol>
    </div>
  </section>`;

  const noOneInsideBlock = `
  <section class="section section--alt">
    <div class="container container--narrow">
      ${sectionHead({
        index: '02',
        eyebrow: 'Bez osoby v kabíne',
        title: 'Výťah nefunguje, ale nikto v ňom nie je',
      })}
      <div class="prose">
        <p>
          Takáto situácia sa nerieši ako havária, ale ako porucha. Dôležité je, aby výťah
          medzitým nikto nepoužíval.
        </p>
        <ol>
          <li>Označte výťah ako mimo prevádzky, aby ho nikto nepoužil.</li>
          <li>Ak je to bezpečné, poznačte si, ako sa porucha prejavuje.</li>
          <li>Nahláste poruchu s adresou objektu a poradím výťahu.</li>
          <li>Pošlite fotografiu výrobného štítku, ak k nemu máte prístup.</li>
        </ol>
        <p>
          Podrobnosti o priebehu opravy nájdete na stránke
          <a href="/opravy-vytahov/">opravy výťahov</a>.
        </p>
      </div>
    </div>
  </section>`;

  const scopeBlock = `
  <section class="section">
    <div class="container">
      ${sectionHead({
        index: '03',
        eyebrow: 'Rozsah',
        title: 'Čo havarijná služba rieši',
        lead: 'Situácie, ktoré neznesú odklad. Ostatné poruchy sa riešia ako bežná oprava.',
      })}
      <ul class="deliverables">
        ${map(
          [
            {
              title: 'Vyslobodenie osôb z kabíny',
              text: 'Uvoľnenie osôb uviaznutých vo výťahu vyškolenou osobou.',
            },
            {
              title: 'Uvedenie zariadenia do bezpečného stavu',
              text: 'Zabezpečenie výťahu tak, aby ho nebolo možné ďalej používať.',
            },
            {
              title: 'Posúdenie príčiny',
              text: 'Zistenie, čo poruchu spôsobilo, a rozhodnutie o ďalšom postupe.',
            },
            {
              title: 'Odovzdanie informácií',
              text: 'Správcovi alebo zodpovednej osobe oznámime, čo sa stalo a čo bude nasledovať.',
            },
          ],
          (d) => `
        <li class="deliverables__item" data-reveal="stagger">
          <span class="deliverables__tick" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m3 8.5 3.5 3.5L13 5" stroke="currentColor" stroke-width="1.8"/></svg>
          </span>
          <span>
            <strong class="deliverables__title">${esc(d.title)}</strong>
            <span class="deliverables__text">${esc(d.text)}</span>
          </span>
        </li>`
        )}
      </ul>
    </div>
  </section>`;

  const reportBlock = `
  <section class="section section--alt">
    <div class="container container--narrow">
      ${sectionHead({
        index: '04',
        eyebrow: 'Nahlásenie',
        title: 'Čo potrebujeme vedieť pri nahlásení',
      })}
      <div class="prose">
        <ul>
          <li>Adresu objektu a vchod</li>
          <li>Ktorý výťah v poradí, ak je ich v objekte viac</li>
          <li>Či je v kabíne osoba</li>
          <li>Ako sa porucha prejavuje</li>
          <li>Telefónne číslo, na ktorom vás zastihneme</li>
        </ul>
      </div>
    </div>
  </section>`;

  const main = [
    pageHero,
    trappedBlock,
    noOneInsideBlock,
    scopeBlock,
    reportBlock,
    faqSection(faq.havaria, { index: '05', heading: 'Časté otázky' }),
    relatedServices(s.id),
    ctaBand(company, {
      title: 'Potrebujete zabezpečiť havarijnú službu pre váš objekt?',
      text: 'Napíšte nám adresu objektu a počet zariadení. Ozveme sa s možnosťami.',
      primaryHref: '/kontakt/?typ=pravidelny-servis#dopyt',
    }),
  ].join('\n');

  return {
    path: s.path,
    title: s.metaTitle,
    description: s.metaDescription,
    crumbs,
    bodyClass: 'page-service page-service--havaria',
    schemas: [
      organizationSchema(company),
      serviceSchema(company, s),
      breadcrumbSchema(company, crumbs),
      faqSchema(faq.havaria),
    ],
    main,
  };
}
