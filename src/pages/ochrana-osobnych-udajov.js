/**
 * /ochrana-osobnych-udajov/
 *
 * Stránka je potrebná preto, že web zbiera osobné údaje cez formulár.
 *
 * ⚠ DÔLEŽITÉ
 * Vykresľujú sa LEN sekcie, ktoré vieme pravdivo naplniť. Chýbajúce údaje
 * (doba uchovávania, príjemcovia, IČO, adresa, kontakt na uplatnenie práv)
 * sa NEDOPĹŇAJÚ všeobecnými frázami — sekcia sa jednoducho nevykreslí.
 *
 * Finálne znenie musí pred spustením webu odsúhlasiť klient.
 * Viď docs/MISSING_DATA.md → „finálne GDPR údaje".
 */

import { esc, isSet, when, map } from '../lib/html.js';
import { organizationSchema, breadcrumbSchema } from '../lib/seo.js';
import { inquiryFields } from '../../data/forms.js';

export default function page(ctx) {
  const { company } = ctx;

  const crumbs = [
    { label: 'Domov', path: '/' },
    { label: 'Ochrana osobných údajov', path: '/ochrana-osobnych-udajov/' },
  ];

  const identifiers = [
    isSet(company.legal.ico) ? `IČO: ${company.legal.ico}` : null,
    isSet(company.legal.dic) ? `DIČ: ${company.legal.dic}` : null,
    isSet(company.address.street)
      ? `Sídlo: ${[company.address.street, [company.address.postalCode, company.address.city].filter(Boolean).join(' ')]
          .filter(Boolean)
          .join(', ')}`
      : null,
    isSet(company.legal.registration) ? `Zápis: ${company.legal.registration}` : null,
  ].filter(Boolean);

  const contactChannels = [
    isSet(company.contact.email) ? `e-mailom na ${company.contact.email}` : null,
    isSet(company.contact.phone) ? `telefonicky na ${company.contact.phone}` : null,
    isSet(company.address.street) ? 'písomne na adrese sídla spoločnosti' : null,
  ].filter(Boolean);

  const main = `
  <section class="page-hero">
    <div class="container">
      <div class="page-hero__inner">
        <p class="eyebrow"><span class="eyebrow__num">01</span>Právne informácie</p>
        <h1 class="page-hero__title">Ochrana osobných údajov</h1>
        <p class="page-hero__lead">
          Informácie o tom, aké údaje z tohto webu spracúvame, prečo a aké máte práva.
        </p>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container container--narrow">
      <div class="prose">

        <h2>Prevádzkovateľ</h2>
        <p>
          Prevádzkovateľom, ktorý spracúva osobné údaje zadané cez tento web, je
          <strong>${esc(company.legalName)}</strong>.
        </p>
        ${when(
          isSet(identifiers),
          () => `<ul>${map(identifiers, (i) => `<li>${esc(i)}</li>`)}</ul>`
        )}

        <h2>Aké údaje spracúvame</h2>
        <p>
          Spracúvame výhradne údaje, ktoré nám sami odošlete cez dopytový formulár:
        </p>
        <ul>
          ${map(inquiryFields, (f) => `<li>${esc(f.label)}${f.required ? ' (povinný údaj)' : ''}</li>`)}
        </ul>
        <p>
          Web nepoužíva analytické ani reklamné nástroje a neukladá do vášho prehliadača
          žiadne súbory cookies na sledovanie správania.
        </p>

        <h2>Na aký účel údaje spracúvame</h2>
        <p>
          Údaje používame na vybavenie vášho dopytu — teda na to, aby sme vás mohli
          kontaktovať späť, posúdiť požiadavku a pripraviť odpoveď alebo cenovú ponuku.
          Na iný účel ich nepoužívame.
        </p>

        <h2>Právny základ spracúvania</h2>
        <p>
          Právnym základom je súhlas, ktorý udelíte odoslaním formulára, prípadne
          predzmluvné vzťahy, ak dopyt smeruje k uzavretiu zmluvy. Súhlas môžete
          kedykoľvek odvolať.
        </p>

        ${when(
          isSet(contactChannels),
          () => `
        <h2>Ako si uplatniť práva</h2>
        <p>Svoje práva si môžete uplatniť ${esc(contactChannels.join(', '))}.</p>`
        )}

        <h2>Vaše práva</h2>
        <p>Vo vzťahu k svojim osobným údajom máte najmä právo:</p>
        <ul>
          <li>na prístup k údajom, ktoré o vás spracúvame,</li>
          <li>na opravu nesprávnych alebo neúplných údajov,</li>
          <li>na vymazanie údajov,</li>
          <li>na obmedzenie spracúvania,</li>
          <li>na prenosnosť údajov,</li>
          <li>namietať proti spracúvaniu,</li>
          <li>kedykoľvek odvolať udelený súhlas,</li>
          <li>podať sťažnosť dozornému orgánu.</li>
        </ul>

        <h2>Zmeny tohto dokumentu</h2>
        <p>
          Ak sa rozsah alebo spôsob spracúvania údajov zmení, aktualizujeme aj tento
          dokument a zmenu uvedieme priamo na tejto stránke.
        </p>

      </div>
    </div>
  </section>`;

  return {
    path: '/ochrana-osobnych-udajov/',
    title: `Ochrana osobných údajov | ${company.legalName}`,
    description: `Informácie o spracúvaní osobných údajov odoslaných cez web ${company.legalName} — aké údaje, na aký účel a aké máte práva.`,
    crumbs,
    bodyClass: 'page-legal',
    schemas: [organizationSchema(company), breadcrumbSchema(company, crumbs)],
    main,
  };
}
