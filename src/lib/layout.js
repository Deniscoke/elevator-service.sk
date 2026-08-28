/**
 * Layout — HTML shell, hlavička, pätička, drobčeková navigácia,
 * sticky lišta na mobile.
 *
 * Všetky kontaktné prvky sú podmienené dátami. Ak číslo nemáme,
 * tlačidlo „Zavolať" sa nevykreslí — nikdy nevzniká odkaz do prázdna.
 */

import { esc, isSet, when, map, telHref, absoluteUrl } from './html.js';
import { icon } from './icons.js';
import { renderHead, renderSchemas } from './seo.js';
import { services } from '../../data/services.js';

/* ------------------------------------------------------------------ */
/*  Logo                                                               */
/* ------------------------------------------------------------------ */

/**
 * Kým nemáme firemné logo, používame typografickú značku s geometrickým
 * znakom šachty. Nie je to výplň ani placeholder — je to funkčná dočasná
 * identita, ktorú vymeníme za dodané logo na jednom mieste.
 */
function logo(company, { inverse = false } = {}) {
  if (isSet(company.brand.logo)) {
    const src = inverse && isSet(company.brand.logoInverse) ? company.brand.logoInverse : company.brand.logo;
    return `<img src="${esc(src)}" alt="${esc(company.legalName)}" width="180" height="36" class="logo__img">`;
  }
  return `
    <span class="logo__mark" aria-hidden="true">
      <svg width="54" height="25" viewBox="0 0 132 62" fill="none">
        <path d="M100 0 L 34 38 L 0 38 L 46 18 Z" class="logo__wing logo__wing--accent"
              transform="translate(0 24) scale(0.5)"/>
        <path d="M100 0 L 34 38 L 0 38 L 46 18 Z" class="logo__wing logo__wing--ink"
              transform="translate(32 0)"/>
      </svg></span>
    <span class="logo__text">
      <span class="logo__name">ELEVÁTOR</span><span class="logo__name logo__name--accent">SERVIS</span>
    </span>`;
}

/* ------------------------------------------------------------------ */
/*  Hlavička                                                           */
/* ------------------------------------------------------------------ */

function header(company, currentPath) {
  const isCurrent = (p) => (currentPath === p ? ' aria-current="page"' : '');
  const emergencyPhone = telHref(company.contact.emergencyPhone);
  const inServices = services.some((s) => s.path === currentPath);

  return `
<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="logo" href="/" aria-label="${esc(company.legalName)} — domovská stránka">
      ${logo(company)}
    </a>

    <nav class="nav" id="hlavna-navigacia" aria-label="Hlavná navigácia">
      <ul class="nav__list">
        <li class="nav__item nav__item--has-panel">
          <button type="button" class="nav__link nav__toggle" aria-expanded="false"
                  aria-controls="panel-sluzby"${inServices ? ' data-section-current' : ''}>
            Služby
            <svg class="nav__chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="m2.5 4.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6"/>
            </svg>
          </button>
          <div class="nav__panel" id="panel-sluzby" hidden>
            <ul class="nav__panel-list">
              ${map(
                services,
                (s) => `
              <li>
                <a class="nav__panel-link${s.isEmergency ? ' nav__panel-link--emergency' : ''}"
                   href="${esc(s.path)}"${isCurrent(s.path)}>
                  <span class="nav__panel-icon">${icon(s.icon)}</span>
                  <span>
                    <span class="nav__panel-title">${esc(s.cardTitle)}</span>
                    <span class="nav__panel-desc">${esc(s.summary.split('.')[0])}.</span>
                  </span>
                </a>
              </li>`
              )}
            </ul>
          </div>
        </li>
        <li class="nav__item"><a class="nav__link" href="/o-nas/"${isCurrent('/o-nas/')}>O nás</a></li>
        <li class="nav__item"><a class="nav__link" href="/referencie/"${isCurrent('/referencie/')}>Referencie</a></li>
        <li class="nav__item"><a class="nav__link" href="/poradna/"${isCurrent('/poradna/')}>Poradňa</a></li>
        <li class="nav__item"><a class="nav__link" href="/kariera/"${isCurrent('/kariera/')}>Kariéra</a></li>
        <li class="nav__item"><a class="nav__link" href="/kontakt/"${isCurrent('/kontakt/')}>Kontakt</a></li>
      </ul>
    </nav>

    <div class="site-header__actions">
      ${when(
        company.emergency.enabled && emergencyPhone,
        () => `
      <a class="btn btn--emergency btn--sm" href="${esc(emergencyPhone)}" data-action="emergency-call">
        ${icon('alert')}<span>Havária</span>
      </a>`
      )}
      <a class="btn btn--primary btn--sm site-header__cta" href="/kontakt/#dopyt">Nezáväzný dopyt</a>
      <button type="button" class="burger" aria-expanded="false" aria-controls="mobilne-menu"
              aria-label="Otvoriť menu" data-burger>
        <span class="burger__bar"></span><span class="burger__bar"></span><span class="burger__bar"></span>
      </button>
    </div>
  </div>
</header>

<div class="mobile-menu" id="mobilne-menu" hidden data-mobile-menu>
  <div class="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="mobile-menu__head">
      <span class="mobile-menu__title">Menu</span>
      <button type="button" class="mobile-menu__close" aria-label="Zavrieť menu" data-menu-close>
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="1.8" fill="none"/>
        </svg>
      </button>
    </div>
    <nav aria-label="Mobilná navigácia">
      <p class="mobile-menu__label">Služby</p>
      <ul class="mobile-menu__list">
        ${map(
          services,
          (s) => `<li><a href="${esc(s.path)}"${isCurrent(s.path)}>${esc(s.cardTitle)}</a></li>`
        )}
      </ul>
      <p class="mobile-menu__label">Firma</p>
      <ul class="mobile-menu__list">
        <li><a href="/o-nas/"${isCurrent('/o-nas/')}>O nás</a></li>
        <li><a href="/referencie/"${isCurrent('/referencie/')}>Referencie</a></li>
        <li><a href="/poradna/"${isCurrent('/poradna/')}>Poradňa</a></li>
        <li><a href="/kariera/"${isCurrent('/kariera/')}>Kariéra</a></li>
        <li><a href="/kontakt/"${isCurrent('/kontakt/')}>Kontakt</a></li>
      </ul>
    </nav>
    <div class="mobile-menu__actions">
      <a class="btn btn--primary btn--block" href="/kontakt/#dopyt">Nezáväzný dopyt</a>
      ${when(
        isSet(company.contact.phone),
        () =>
          `<a class="btn btn--ghost btn--block" href="${esc(telHref(company.contact.phone))}">${icon('phone')}<span>${esc(
            company.contact.phone
          )}</span></a>`
      )}
    </div>
  </div>
</div>`;
}

/* ------------------------------------------------------------------ */
/*  Drobčeková navigácia                                               */
/* ------------------------------------------------------------------ */

function breadcrumbs(crumbs) {
  if (!isSet(crumbs) || crumbs.length < 2) return '';
  const last = crumbs.length - 1;
  return `
<nav class="breadcrumbs" aria-label="Drobčeková navigácia">
  <div class="container">
    <ol class="breadcrumbs__list">
      ${crumbs
        .map((c, i) =>
          i === last
            ? `<li class="breadcrumbs__item"><span aria-current="page">${esc(c.label)}</span></li>`
            : `<li class="breadcrumbs__item"><a href="${esc(c.path)}">${esc(c.label)}</a></li>`
        )
        .join('')}
    </ol>
  </div>
</nav>`;
}

/* ------------------------------------------------------------------ */
/*  Pätička                                                            */
/* ------------------------------------------------------------------ */

function footer(company, serviceAreaLabel) {
  const phone = telHref(company.contact.phone);
  const hasContactBlock =
    isSet(company.contact.phone) || isSet(company.contact.email) || isSet(company.address.street);

  const legalBits = [
    isSet(company.legal.ico) ? `IČO: ${esc(company.legal.ico)}` : null,
    isSet(company.legal.dic) ? `DIČ: ${esc(company.legal.dic)}` : null,
    isSet(company.legal.icDph) ? `IČ DPH: ${esc(company.legal.icDph)}` : null,
  ].filter(Boolean);

  return `
<footer class="site-footer">
  <div class="container">
    <div class="site-footer__grid">

      <div class="site-footer__brand">
        <span class="logo logo--footer">${logo(company, { inverse: true })}</span>
        <p class="site-footer__claim">${esc(company.claim)} — ${esc(serviceAreaLabel)}.</p>
      </div>

      <div class="site-footer__col">
        <h2 class="site-footer__heading">Služby</h2>
        <ul class="site-footer__list">
          ${map(services, (s) => `<li><a href="${esc(s.path)}">${esc(s.cardTitle)}</a></li>`)}
        </ul>
      </div>

      <div class="site-footer__col">
        <h2 class="site-footer__heading">Firma</h2>
        <ul class="site-footer__list">
          <li><a href="/o-nas/">O nás</a></li>
          <li><a href="/referencie/">Referencie</a></li>
          <li><a href="/poradna/">Poradňa</a></li>
          <li><a href="/kariera/">Kariéra</a></li>
          <li><a href="/kontakt/">Kontakt</a></li>
        </ul>
      </div>

      ${when(
        hasContactBlock,
        () => `
      <div class="site-footer__col">
        <h2 class="site-footer__heading">Kontakt</h2>
        <ul class="site-footer__list site-footer__list--contact">
          ${when(
            phone,
            () => `<li>${icon('phone')}<a href="${esc(phone)}">${esc(company.contact.phone)}</a></li>`
          )}
          ${when(
            isSet(company.contact.email),
            () =>
              `<li>${icon('mail')}<a href="mailto:${esc(company.contact.email)}">${esc(
                company.contact.email
              )}</a></li>`
          )}
          ${when(
            isSet(company.address.street),
            () => `<li>${icon('pin')}<span>${esc(company.address.street)}, ${esc(
              company.address.postalCode || ''
            )} ${esc(company.address.city)}</span></li>`
          )}
        </ul>
      </div>`
      )}
    </div>

    <div class="site-footer__bottom">
      <p class="site-footer__legal">
        © ${new Date().getFullYear()} ${esc(company.legalName)}${legalBits.length ? ' · ' + legalBits.join(' · ') : ''}
      </p>
      <ul class="site-footer__meta">
        <li><a href="/ochrana-osobnych-udajov/">Ochrana osobných údajov</a></li>
      </ul>
    </div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------------ */
/*  Sticky lišta na mobile                                             */
/* ------------------------------------------------------------------ */

/**
 * Zobrazuje sa len vtedy, keď má čo ponúknuť.
 * Bez telefónu je to jedno tlačidlo cez celú šírku — nie prázdna lišta.
 */
function stickyBar(company) {
  const phone = telHref(company.contact.phone);
  const emergency = telHref(company.contact.emergencyPhone);
  const useEmergency = company.emergency.enabled && emergency;

  const callButton = useEmergency
    ? `<a class="sticky-bar__btn sticky-bar__btn--emergency" href="${esc(emergency)}">
         ${icon('alert')}<span>Havária</span>
       </a>`
    : phone
    ? `<a class="sticky-bar__btn sticky-bar__btn--call" href="${esc(phone)}">
         ${icon('phone')}<span>Zavolať</span>
       </a>`
    : '';

  return `
<div class="sticky-bar" data-sticky-bar>
  ${callButton}
  <a class="sticky-bar__btn sticky-bar__btn--primary${callButton ? '' : ' sticky-bar__btn--full'}" href="/kontakt/#dopyt">
    ${icon('doc')}<span>Nezáväzný dopyt</span>
  </a>
</div>`;
}

/* ------------------------------------------------------------------ */
/*  Kompletná stránka                                                  */
/* ------------------------------------------------------------------ */

export function renderPage({
  company,
  serviceAreaLabel,
  title,
  description,
  path,
  bodyClass = '',
  crumbs = null,
  schemas = [],
  main,
  noindex = false,
  extraHead = '',
  extraScripts = '',
}) {
  return `<!DOCTYPE html>
<html lang="${esc(company.lang)}" class="no-js">
<head>
  <script>document.documentElement.classList.replace('no-js','js')</script>
${renderHead({ company, title, description, path, noindex, extraHead })}
${renderSchemas(company, schemas)}
</head>
<body class="${esc(bodyClass)}">
  <a class="skip-link" href="#obsah">Preskočiť na obsah</a>
${header(company, path)}
${breadcrumbs(crumbs)}
  <main id="obsah">
${main}
  </main>
${footer(company, serviceAreaLabel)}
${stickyBar(company)}
  <script src="/js/site.js" defer></script>
${extraScripts}
</body>
</html>`;
}
