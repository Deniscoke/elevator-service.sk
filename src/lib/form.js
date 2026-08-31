/**
 * Dopytový formulár.
 *
 * Návrh vychádza z toho, že dopyt má byť pre firmu POUŽITEĽNÝ:
 * bez mesta, typu objektu a počtu výťahov sa nedá dať ani orientačná cena,
 * takže by nasledoval telefonát navyše. Preto tie polia sú súčasťou formulára.
 *
 * Backend zatiaľ nie je vybraný. Formulár preto:
 *   - je plne funkčný na strane klienta (validácia, stavy, prístupnosť),
 *   - odosiela cez abstrakciu v static/js/form.js,
 *   - a kým nie je nastavený transport, NEPREDSTIERA odoslanie.
 * Produkčný build (--prod) sa bez nastaveného transportu neskončí úspešne.
 */

import { esc, isSet, when, map, telHref } from './html.js';
import { icon } from './icons.js';
import { inquiryTypes, objectTypes } from '../../data/services.js';
import { forms } from '../../data/forms.js';

/** Označenie povinného poľa — vizuálne aj pre čítačky obrazovky. */
const req = '<span class="req" title="Povinné pole"><span class="visually-hidden"> (povinné)</span>*</span>';

function field({ id, label, type = 'text', required = false, autocomplete, hint, ...rest }) {
  const describedBy = hint ? `${id}-hint` : null;
  const common =
    `id="${esc(id)}" name="${esc(id)}"` +
    (required ? ' required' : '') +
    (autocomplete ? ` autocomplete="${esc(autocomplete)}"` : '') +
    (describedBy ? ` aria-describedby="${esc(describedBy)}"` : '') +
    (rest.min !== undefined ? ` min="${esc(rest.min)}"` : '') +
    (rest.max !== undefined ? ` max="${esc(rest.max)}"` : '') +
    (rest.inputmode ? ` inputmode="${esc(rest.inputmode)}"` : '') +
    (rest.placeholder ? ` placeholder="${esc(rest.placeholder)}"` : '');

  let control;
  if (type === 'textarea') {
    control = `<textarea class="input input--textarea" rows="5" ${common}></textarea>`;
  } else if (type === 'select') {
    control = `<div class="select-wrap"><select class="input input--select" ${common}>
        <option value="">${esc(rest.emptyLabel || 'Vyberte…')}</option>
        ${map(rest.options, (o) => `<option value="${esc(o.value)}"${o.value === rest.selected ? ' selected' : ''}>${esc(o.label)}</option>`)}
      </select><span class="select-wrap__chevron" aria-hidden="true"></span></div>`;
  } else {
    control = `<input class="input" type="${esc(type)}" ${common}>`;
  }

  return `
        <div class="field">
          <label class="field__label" for="${esc(id)}">${esc(label)}${required ? req : ''}</label>
          ${control}
          ${when(hint, () => `<p class="field__hint" id="${esc(id)}-hint">${esc(hint)}</p>`)}
          <p class="field__error" id="${esc(id)}-error" data-error-for="${esc(id)}" hidden></p>
        </div>`;
}

/**
 * @param {object} opts
 * @param {string} opts.preselect  predvolený typ požiadavky (id služby)
 * @param {string} opts.context    'dopyt' | 'kariera' — mení texty a payload
 */
export function inquiryForm(company, { preselect = '', context = 'dopyt', heading = null, isDev = false } = {}) {
  const isCareer = context === 'kariera';
  const configured = isSet(forms.transport) && (forms.transport === 'mailto' || isSet(forms.endpoint));
  const altPhone = telHref(company.contact.phone);
  const altEmail = company.contact.email;

  const typeOptions = isCareer
    ? [{ value: 'kariera', label: 'Kariéra / spolupráca' }]
    : inquiryTypes;

  return `
      <form class="form" id="dopyt-form" novalidate
            data-form
            data-context="${esc(context)}"
            data-transport="${esc(configured ? forms.transport : 'none')}"
            data-has-contact="${isSet(company.contact.phone) || isSet(company.contact.email) ? 'true' : 'false'}"
            ${configured && isSet(forms.endpoint) ? `data-endpoint="${esc(forms.endpoint)}"` : ''}
            data-honeypot="${esc(forms.antispam.honeypot)}"
            data-min-fill="${esc(forms.antispam.minFillSeconds)}">

        ${when(heading, () => `<h2 class="form__heading">${esc(heading)}</h2>`)}

        <fieldset class="form__group">
          <legend class="form__legend"><span class="form__legend-num">01</span>Kontakt</legend>
          <div class="form__row">
            ${field({ id: 'meno', label: 'Meno a priezvisko', required: true, autocomplete: 'name' })}
            ${field({
              id: 'firma',
              label: isCareer ? 'Aktuálny zamestnávateľ' : 'Firma / SVB / správca',
              autocomplete: 'organization',
            })}
          </div>
          <div class="form__row">
            ${field({ id: 'telefon', label: 'Telefón', type: 'tel', autocomplete: 'tel', inputmode: 'tel' })}
            ${field({ id: 'email', label: 'E-mail', type: 'email', autocomplete: 'email' })}
          </div>
          <p class="form__note">Vyplňte aspoň jeden kontakt — telefón alebo e-mail.</p>
        </fieldset>

        ${when(
          !isCareer,
          () => `
        <fieldset class="form__group">
          <legend class="form__legend"><span class="form__legend-num">02</span>Objekt</legend>
          <div class="form__row">
            ${field({
              id: 'mesto',
              label: 'Mesto alebo obec',
              required: true,
              autocomplete: 'address-level2',
              hint: 'Kde sa zariadenie nachádza.',
            })}
            ${field({
              id: 'typObjektu',
              label: 'Typ objektu',
              type: 'select',
              options: objectTypes,
              emptyLabel: 'Vyberte typ objektu…',
            })}
          </div>
          <div class="form__row form__row--split">
            ${field({
              id: 'pocetVytahov',
              label: 'Počet výťahov',
              type: 'number',
              min: 1,
              max: 500,
              inputmode: 'numeric',
              hint: 'Koľko zariadení sa dopyt týka.',
            })}
          </div>
        </fieldset>`
        )}

        <fieldset class="form__group">
          <legend class="form__legend"><span class="form__legend-num">${isCareer ? '02' : '03'}</span>${
            isCareer ? 'Vaša správa' : 'Požiadavka'
          }</legend>
          ${when(
            !isCareer,
            () => `
          ${field({
            id: 'typPoziadavky',
            label: 'Typ požiadavky',
            type: 'select',
            required: true,
            options: typeOptions,
            selected: preselect,
            emptyLabel: 'Vyberte typ požiadavky…',
          })}`
          )}
          ${field({
            id: 'sprava',
            label: isCareer ? 'Krátko o vás' : 'Popis problému alebo požiadavky',
            type: 'textarea',
            required: true,
            hint: isCareer
              ? 'Aké máte skúsenosti a o akú spoluprácu máte záujem.'
              : 'Čím konkrétnejší popis, tým presnejšia odpoveď. Pomôže typ zariadenia z výrobného štítku.',
          })}

          ${when(
            forms.attachments.enabled,
            () => `
          <div class="field field--files">
            <label class="field__label" for="prilohy">Prílohy</label>
            <input class="input input--file" type="file" id="prilohy" name="prilohy" multiple
                   accept="${esc(forms.attachments.accept)}"
                   aria-describedby="prilohy-hint">
            <p class="field__hint" id="prilohy-hint">
              ${esc(forms.attachments.hints.join(' · '))} — max. ${esc(forms.attachments.maxFiles)} súbory,
              do ${esc(forms.attachments.maxSizeMb)} MB.
            </p>
            <p class="field__error" id="prilohy-error" data-error-for="prilohy" hidden></p>
          </div>`
          )}
        </fieldset>

        <div class="field field--consent">
          <label class="checkbox">
            <input type="checkbox" id="suhlas" name="suhlas" required>
            <span class="checkbox__box" aria-hidden="true"></span>
            <span class="checkbox__text">
              Súhlasím so spracúvaním osobných údajov na účel vybavenia tohto dopytu.${req}
              <a href="/ochrana-osobnych-udajov/">Viac o ochrane osobných údajov</a>
            </span>
          </label>
          <p class="field__error" id="suhlas-error" data-error-for="suhlas" hidden></p>
        </div>

        <!-- Ochrana proti botom: pole je skryté pre ľudí, boty ho vyplnia. -->
        <div class="hp" aria-hidden="true">
          <label for="${esc(forms.antispam.honeypot)}">Nevypĺňajte toto pole</label>
          <input type="text" id="${esc(forms.antispam.honeypot)}" name="${esc(
    forms.antispam.honeypot
  )}" tabindex="-1" autocomplete="off">
        </div>

        <div class="form__submit">
          <button type="submit" class="btn btn--primary btn--lg">
            <span>${isCareer ? 'Odoslať' : 'Odoslať dopyt'}</span>${icon('arrow')}
          </button>
          <p class="form__submit-note">Odpovieme na e-mail alebo telefón, ktorý uvediete.</p>
        </div>

        <!-- Stavová správa. aria-live oznámi výsledok aj čítačke obrazovky. -->
        <div class="form__status" data-form-status role="status" aria-live="polite" hidden></div>

        ${when(
          !configured && isDev,
          () => `
        <p class="form__preview-warning" data-preview-warning>
          <strong>Náhľadová verzia.</strong> Odosielanie formulára ešte nie je napojené na backend,
          preto sa dopyt neodošle.${
            altPhone || altEmail
              ? ' Zatiaľ použite ' +
                [
                  altPhone ? `<a href="${esc(altPhone)}">telefón</a>` : null,
                  altEmail ? `<a href="mailto:${esc(altEmail)}">e-mail</a>` : null,
                ]
                  .filter(Boolean)
                  .join(' alebo ') +
                '.'
              : ''
          }
        </p>`
        )}
      </form>`;
}
