/**
 * 404.html
 *
 * Chybová stránka nie je len oznam. Je to posledná šanca udržať návštevníka
 * na webe, takže ponúka konkrétne pokračovanie — vrátane havarijnej situácie,
 * ktorá znesie odklad najmenej.
 */

import { esc, map } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { btn } from '../lib/components.js';
import { services } from '../../data/services.js';

export default function page(ctx) {
  const { company } = ctx;

  const main = `
  <section class="page-hero">
    <div class="container">
      <div class="page-hero__inner">
        <p class="eyebrow"><span class="eyebrow__num">404</span>Stránka sa nenašla</p>
        <h1 class="page-hero__title">Táto stránka neexistuje</h1>
        <p class="page-hero__lead">
          Odkaz môže byť starý alebo v adrese vznikol preklep.
          Skúste pokračovať niektorou z ciest nižšie.
        </p>
        <div class="page-hero__actions">
          ${btn('Späť na úvod', '/', { variant: 'primary', size: 'lg', iconName: 'arrow' })}
          ${btn('Napísať dopyt', '/kontakt/#dopyt', { variant: 'secondary', size: 'lg' })}
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2 class="related__heading">Služby</h2>
      <ul class="related">
        ${map(
          services,
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

      <h2 class="related__heading mt-xl">Ďalšie stránky</h2>
      <ul class="related">
        ${map(
          [
            { label: 'O nás', path: '/o-nas/' },
            { label: 'Referencie', path: '/referencie/' },
            { label: 'Poradňa', path: '/poradna/' },
            { label: 'Kariéra', path: '/kariera/' },
          ],
          (l) => `
        <li class="related__item">
          <a class="related__link" href="${esc(l.path)}">
            <span class="related__label">${esc(l.label)}</span>
            ${icon('arrow')}
          </a>
        </li>`
        )}
      </ul>
    </div>
  </section>`;

  return {
    // 404 sa umiestňuje do koreňa ako súbor, nie ako adresár.
    path: '/404.html',
    file: '404.html',
    title: `Stránka sa nenašla | ${company.legalName}`,
    description: 'Požadovaná stránka neexistuje. Pokračujte na úvodnú stránku alebo na prehľad služieb.',
    crumbs: null,
    bodyClass: 'page-404',
    schemas: [],
    noindex: true,
    sitemap: false,
    main,
  };
}
