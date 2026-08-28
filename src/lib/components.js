/**
 * Znovupoužiteľné sekcie stránok.
 *
 * Každý komponent, ktorý pracuje s neistými dátami, sa riadi jedným pravidlom:
 * ak nie je čo zobraziť, vráti prázdny string — nie prázdny obal, nie zástupný text.
 * Build zaznamená, čo sa vynechalo, do docs/BUILD_REPORT.md.
 */

import { esc, isSet, when, map, telHref } from './html.js';
import { icon } from './icons.js';
import { services, serviceById } from '../../data/services.js';
import { segments, references } from '../../data/references.js';

/** Zoznam komponentov skrytých pre chýbajúce dáta — plní build report. */
export const hidden = [];
function skip(component, reason) {
  hidden.push({ component, reason });
  return '';
}

/* ------------------------------------------------------------------ */
/*  Stavebné prvky                                                     */
/* ------------------------------------------------------------------ */

/** Nadpis sekcie s technickým „eyebrow" štítkom a poradovým číslom. */
export function sectionHead({ index, eyebrow, title, lead, level = 2, align = 'start' }) {
  const H = `h${level}`;
  return `
      <header class="section-head section-head--${esc(align)}">
        ${when(
          eyebrow,
          () => `<p class="eyebrow">${when(index, () => `<span class="eyebrow__num">${esc(index)}</span>`)}${esc(
            eyebrow
          )}</p>`
        )}
        <${H} class="section-head__title">${title}</${H}>
        ${when(lead, () => `<p class="section-head__lead">${lead}</p>`)}
      </header>`;
}

/** Tlačidlo. */
export function btn(label, href, { variant = 'primary', size = '', block = false, iconName = null } = {}) {
  const cls = ['btn', `btn--${variant}`, size ? `btn--${size}` : '', block ? 'btn--block' : '']
    .filter(Boolean)
    .join(' ');
  return `<a class="${cls}" href="${esc(href)}">${when(iconName, () => icon(iconName))}<span>${esc(label)}</span></a>`;
}

/* ------------------------------------------------------------------ */
/*  Trust layer                                                        */
/* ------------------------------------------------------------------ */

/**
 * Pás dôveryhodnosti.
 * Zobrazí sa len vtedy, keď má aspoň dve reálne položky — jedna osamotená
 * dlaždica pôsobí chudobnejšie než žiadna.
 */
export function trustBar(company, serviceAreaLabel) {
  const items = [];

  if (isSet(company.stats.yearsInBusiness)) {
    items.push({ value: company.stats.yearsInBusiness, label: 'rokov na trhu', icon: 'clock' });
  }
  if (isSet(company.stats.servicedLifts)) {
    items.push({ value: company.stats.servicedLifts, label: 'servisovaných výťahov', icon: 'gear' });
  }
  if (isSet(company.stats.technicians)) {
    items.push({ value: company.stats.technicians, label: 'servisných technikov', icon: 'people' });
  }
  items.push({ value: null, text: serviceAreaLabel, label: 'servisná oblasť', icon: 'pin' });

  if (company.emergency.enabled && isSet(company.emergency.hoursLabel)) {
    items.push({ value: null, text: company.emergency.hoursLabel, label: 'havarijná služba', icon: 'alert' });
  }
  if (isSet(company.certifications)) {
    items.push({
      value: company.certifications.length,
      label: 'odborné oprávnenia',
      icon: 'shield',
    });
  }

  if (items.length < 2) {
    return skip('trustBar', 'menej než 2 overené údaje (chýbajú roky, počet výťahov, technici, oprávnenia)');
  }

  return `
  <section class="trust" aria-label="Základné údaje o firme">
    <div class="container">
      <ul class="trust__list">
        ${map(
          items,
          (it) => `
        <li class="trust__item">
          <span class="trust__icon">${icon(it.icon)}</span>
          <span class="trust__value">${esc(it.value !== null && it.value !== undefined ? it.value : it.text)}</span>
          <span class="trust__label">${esc(it.label)}</span>
        </li>`
        )}
      </ul>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  Služby                                                             */
/* ------------------------------------------------------------------ */

export function serviceGrid({ index = '02', heading = 'Čo pre vás vieme urobiť', lead = null, exclude = [] } = {}) {
  const list = services.filter((s) => !exclude.includes(s.id));
  return `
  <section class="section" id="sluzby">
    <div class="container">
      ${sectionHead({ index, eyebrow: 'Služby', title: esc(heading), lead })}
      <ul class="card-grid card-grid--services">
        ${map(
          list,
          (s, i) => `
        <li class="card card--service${s.isEmergency ? ' card--emergency' : ''}" data-reveal="stagger">
          <span class="card__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
          <span class="card__icon">${icon(s.icon)}</span>
          <h3 class="card__title"><a class="card__link" href="${esc(s.path)}">${esc(s.cardTitle)}</a></h3>
          <p class="card__text">${esc(s.summary)}</p>
          <span class="card__cta" aria-hidden="true">Zistiť viac ${icon('arrow')}</span>
        </li>`
        )}
      </ul>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  Akvizičná sekcia — najhodnotnejšia konverzia webu                  */
/* ------------------------------------------------------------------ */

export function acquisition({ index = '03' } = {}) {
  return `
  <section class="section section--acquisition" id="novy-servis">
    <div class="container">
      <div class="acquisition on-dark">
        <div class="acquisition__content">
          <p class="eyebrow"><span class="eyebrow__num">${esc(index)}</span>Nový servisný partner</p>
          <h2 class="acquisition__title">Hľadáte nového servisného partnera pre váš výťah?</h2>
          <p class="acquisition__lead">
            Prevzatie výťahu do servisu je bežný proces a nemusí byť komplikovaný.
            Pozrieme sa na zariadenie a dokumentáciu, povieme vám, v akom je stave,
            a dostanete ponuku s konkrétnym rozsahom a intervalom úkonov.
          </p>
          <ul class="acquisition__list">
            <li>Obhliadka zariadenia a jeho dokumentácie</li>
            <li>Návrh rozsahu servisu podľa typu a veku výťahu</li>
            <li>Cena vrátane toho, čo v nej nie je</li>
            <li>Pomoc s prechodom od doterajšej servisnej firmy</li>
          </ul>
          <div class="acquisition__actions">
            ${btn('Vyžiadať ponuku na servis', '/kontakt/#dopyt', { variant: 'primary', iconName: 'arrow' })}
            ${btn('Ako prebieha prevzatie', '/servis-vytahov/#ako-to-prebieha', { variant: 'ghost-invert' })}
          </div>
        </div>
        <figure class="acquisition__aside">
          <img src="/assets/foto/servis-strojovna.jpg" width="1400" height="910"
               alt="Strojovňa výťahu s trakčným strojom a nosnými lanami"
               loading="lazy" decoding="async">
        </figure>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  Problémy zákazníka (namiesto „prečo my")                           */
/* ------------------------------------------------------------------ */

export function problemGrid(problems, { index = '01' } = {}) {
  return `
  <section class="section section--alt" id="problemy">
    <div class="container">
      ${sectionHead({
        index,
        eyebrow: 'Kedy nás ľudia volajú',
        title: 'Poznáte niektorú z týchto situácií?',
        lead: 'Každá z nich má riešenie aj konkrétny ďalší krok.',
      })}
      <ul class="card-grid card-grid--problems">
        ${map(problems, (p) => {
          const svc = serviceById[p.serviceId];
          return `
        <li class="card card--problem" data-reveal="stagger">
          <h3 class="card__title card__title--sm">${esc(p.title)}</h3>
          <p class="card__text">${esc(p.text)}</p>
          ${svc ? `<a class="card__inline-link" href="${esc(svc.path)}">${esc(p.linkLabel)} ${icon('arrow')}</a>` : ''}
        </li>`;
        })}
      </ul>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  Priebeh spolupráce                                                 */
/* ------------------------------------------------------------------ */

export function processSteps(steps, { index = '04', heading = 'Ako prebieha spolupráca', id = 'ako-to-prebieha', lead = null } = {}) {
  return `
  <section class="section" id="${esc(id)}">
    <div class="container">
      ${sectionHead({ index, eyebrow: 'Postup', title: esc(heading), lead })}
      <ol class="steps">
        ${map(
          steps,
          (s, i) => `
        <li class="steps__item" data-reveal="stagger">
          <span class="steps__num">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="steps__title">${esc(s.title)}</h3>
          <p class="steps__text">${esc(s.text)}</p>
        </li>`
        )}
      </ol>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  Čo dostanete                                                       */
/* ------------------------------------------------------------------ */

export function deliverableStrip(items) {
  return `
  <section class="section section--tight">
    <div class="container">
      <ul class="deliverables">
        ${map(
          items,
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
}

/* ------------------------------------------------------------------ */
/*  Segmenty                                                           */
/* ------------------------------------------------------------------ */

/**
 * POZOR na formulácie: toto sú segmenty, PRE KTORÉ je služba určená.
 * Nie zoznam existujúcich klientov.
 */
export function segmentSection({ index = '05' } = {}) {
  return `
  <section class="section section--alt" id="pre-koho">
    <div class="container">
      ${sectionHead({
        index,
        eyebrow: 'Pre koho',
        title: 'Komu sú naše služby určené',
        lead: 'Rozsah servisu prispôsobujeme typu objektu a intenzite prevádzky.',
      })}
      <ul class="segments">
        ${map(
          segments,
          (s) => `
        <li class="segments__item" data-reveal="stagger">
          <h3 class="segments__title">${esc(s.title)}</h3>
          <p class="segments__text">${esc(s.text)}</p>
        </li>`
        )}
      </ul>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  Referencie                                                         */
/* ------------------------------------------------------------------ */

/**
 * Referencie sa vykreslia len z reálnych dát so súhlasom klienta.
 * Prázdne pole = sekcia sa nevykreslí. Žiadne „ukážkové" realizácie.
 */
export function referenceSection({ index = '06', limit = 3, showEmptyState = false } = {}) {
  const published = references.filter((r) => r.consent);

  if (!isSet(published)) {
    if (!showEmptyState) return skip('referenceSection', 'data/references.js je prázdne (chýbajú realizácie a súhlasy)');
    return `
  <section class="section">
    <div class="container">
      ${sectionHead({ index, eyebrow: 'Referencie', title: 'Realizácie' })}
      <div class="empty-state">
        <p class="empty-state__text">
          Konkrétne realizácie zverejníme po dohode so zákazníkmi, ktorých sa týkajú.
          Ak potrebujete referenciu na podobný objekt ako je ten váš, napíšte nám —
          pošleme ju priamo.
        </p>
        ${btn('Vyžiadať referenciu', '/kontakt/#dopyt', { variant: 'secondary' })}
      </div>
    </div>
  </section>`;
  }

  const list = published.slice(0, limit);
  return `
  <section class="section" id="referencie">
    <div class="container">
      ${sectionHead({ index, eyebrow: 'Referencie', title: 'Vybrané realizácie' })}
      <ul class="card-grid card-grid--refs">
        ${map(
          list,
          (r) => `
        <li class="card card--ref" data-reveal="stagger">
          ${when(
            isSet(r.image),
            () =>
              `<img class="card__media" src="${esc(r.image.src)}" alt="${esc(r.image.alt)}" width="${esc(
                r.image.width
              )}" height="${esc(r.image.height)}" loading="lazy" decoding="async">`
          )}
          <div class="card__body">
            <p class="card__meta">${esc([r.city, r.year].filter(Boolean).join(' · '))}</p>
            <h3 class="card__title card__title--sm">${esc(r.title)}</h3>
            <p class="card__text">${esc(r.summary)}</p>
          </div>
        </li>`
        )}
      </ul>
      <p class="section__more">${btn('Všetky referencie', '/referencie/', { variant: 'secondary' })}</p>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  Havarijné CTA                                                      */
/* ------------------------------------------------------------------ */

/**
 * Havarijná sekcia má dva režimy:
 *  A) číslo je potvrdené  → veľké tel: tlačidlo, ideálne na mobil
 *  B) číslo nemáme        → sekcia zostáva, ale namiesto falošného odkazu
 *                            ponúka to, čo naozaj pomôže: postup pri uviaznutí
 */
export function emergencyCta(company, { index = '07', compact = false } = {}) {
  const tel = telHref(company.contact.emergencyPhone);
  const live = company.emergency.enabled && tel;

  return `
  <section class="section section--emergency" id="havaria">
    <div class="container">
      <div class="emergency${compact ? ' emergency--compact' : ''}">
        <div class="emergency__content">
          <p class="eyebrow"><span class="eyebrow__num">${esc(index)}</span>Havarijná služba</p>
          <h2 class="emergency__title">Uviazol niekto vo výťahu alebo je zariadenie v nebezpečnom stave?</h2>
          ${
            live
              ? `<p class="emergency__lead">Volajte havarijnú linku. ${
                  isSet(company.emergency.hoursLabel) ? esc(company.emergency.hoursLabel) + '.' : ''
                }</p>
          <div class="emergency__actions">
            <a class="btn btn--emergency btn--lg" href="${esc(tel)}">
              ${icon('phone')}<span>${esc(company.contact.emergencyPhone)}</span>
            </a>
            ${btn('Postup pri uviaznutí', '/havarijna-sluzba/', { variant: 'ghost-invert' })}
          </div>`
              : `<p class="emergency__lead">
            Nepokúšajte sa otvárať dvere ani opustiť kabínu vlastnými silami.
            Stlačte a podržte tlačidlo núdzového volania v kabíne a počkajte na príchod technika.
          </p>
          <div class="emergency__actions">
            ${btn('Čo robiť pri uviaznutí vo výťahu', '/havarijna-sluzba/', {
              variant: 'emergency',
              size: 'lg',
              iconName: 'arrow',
            })}
          </div>`
          }
        </div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  Kariéra — teaser                                                   */
/* ------------------------------------------------------------------ */

export function careersTeaser(positions, { index = '08' } = {}) {
  const open = isSet(positions);
  return `
  <section class="section section--alt" id="kariera">
    <div class="container">
      <div class="teaser">
        <div>
          <p class="eyebrow"><span class="eyebrow__num">${esc(index)}</span>Kariéra</p>
          <h2 class="teaser__title">Práca vo výťahovom servise</h2>
          <p class="teaser__text">
            ${
              open
                ? `Aktuálne obsadzujeme ${positions.length} ${
                    positions.length === 1 ? 'pozíciu' : positions.length < 5 ? 'pozície' : 'pozícií'
                  }. Pozrite si, čo práca obnáša a čo je potrebné.`
                : 'Momentálne nemáme zverejnenú voľnú pozíciu. Na kariérnej stránke nájdete, čo o pozícii zverejníme, keď ju otvoríme.'
            }
          </p>
        </div>
        <div class="teaser__action">
          ${btn(open ? 'Pozrieť pozície' : 'Kariérna stránka', '/kariera/', { variant: 'secondary', iconName: 'arrow' })}
        </div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

/**
 * Accordion je progressive enhancement nad <details>.
 * Bez JavaScriptu funguje natívne, obsah je v HTML a indexovateľný.
 */
export function faqSection(items, { index = '09', heading = 'Časté otázky', id = 'faq' } = {}) {
  if (!isSet(items)) return '';
  return `
  <section class="section" id="${esc(id)}">
    <div class="container container--narrow">
      ${sectionHead({ index, eyebrow: 'FAQ', title: esc(heading) })}
      <div class="accordion" data-accordion>
        ${map(
          items,
          (it, i) => `
        <details class="accordion__item"${i === 0 ? ' open' : ''}>
          <summary class="accordion__summary">
            <span>${esc(it.q)}</span>
            <span class="accordion__icon" aria-hidden="true"></span>
          </summary>
          <div class="accordion__panel"><p>${esc(it.a)}</p></div>
        </details>`
        )}
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  Záverečné CTA                                                      */
/* ------------------------------------------------------------------ */

export function ctaBand(company, { title, text, primaryLabel = 'Nezáväzný dopyt', primaryHref = '/kontakt/#dopyt' } = {}) {
  const tel = telHref(company.contact.phone);
  return `
  <section class="section section--cta">
    <div class="container">
      <div class="cta-band">
        <div>
          <h2 class="cta-band__title">${esc(title)}</h2>
          ${when(text, () => `<p class="cta-band__text">${esc(text)}</p>`)}
        </div>
        <div class="cta-band__actions">
          ${btn(primaryLabel, primaryHref, { variant: 'primary', size: 'lg', iconName: 'arrow' })}
          ${when(
            tel,
            () =>
              `<a class="btn btn--ghost btn--lg" href="${esc(tel)}">${icon('phone')}<span>${esc(
                company.contact.phone
              )}</span></a>`
          )}
        </div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/*  Súvisiace služby — interné prelinkovanie                           */
/* ------------------------------------------------------------------ */

export function relatedServices(currentId, { heading = 'Súvisiace služby' } = {}) {
  const list = services.filter((s) => s.id !== currentId).slice(0, 4);
  return `
  <section class="section section--tight section--alt">
    <div class="container">
      <h2 class="related__heading">${esc(heading)}</h2>
      <ul class="related">
        ${map(
          list,
          (s) => `
        <li class="related__item">
          <a class="related__link" href="${esc(s.path)}">
            <span class="related__icon">${icon(s.icon)}</span>
            <span class="related__label">${esc(s.cardTitle)}</span>
            ${icon('arrow')}
          </a>
        </li>`
        )}
      </ul>
    </div>
  </section>`;
}
