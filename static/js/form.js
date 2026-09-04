/**
 * form.js — validácia a odoslanie dopytového formulára
 *
 * ARCHITEKTÚRA
 * Formulár nevie, kam sa odosiela. Vie len to, že existuje „transport",
 * ktorý dostane payload a vráti promise. Vďaka tomu sa dá backend vymeniť
 * bez zásahu do validácie aj UI — mení sa jedna hodnota v data/forms.js.
 *
 *   transport === 'none'      → odoslanie nie je nakonfigurované.
 *                               Formulár to POVIE. Nepredstiera úspech.
 *   transport === 'json'      → POST application/json
 *   transport === 'formdata'  → POST multipart/form-data
 *   transport === 'mailto'    → otvorí e-mailového klienta
 */
(function () {
  'use strict';

  var form = document.querySelector('[data-form]');
  if (!form) return;

  var statusEl = form.querySelector('[data-form-status]');
  var submitBtn = form.querySelector('button[type="submit"]');
  var mountedAt = Date.now();

  /* ================================================================
     VALIDAČNÉ PRAVIDLÁ
     ================================================================ */

  var messages = {
    required: 'Toto pole je potrebné vyplniť.',
    email: 'Skontrolujte tvar e-mailovej adresy.',
    phone: 'Skontrolujte tvar telefónneho čísla.',
    contact: 'Uveďte aspoň jeden kontakt — telefón alebo e-mail.',
    short: 'Napíšte, prosím, aspoň pár slov k požiadavke.',
    consent: 'Pred odoslaním potvrďte, že ste sa oboznámili s informáciami o spracúvaní údajov.',
    number: 'Zadajte počet výťahov ako číslo.',
  };

  // Zámerne voľný vzor: prísna validácia e-mailu odmieta platné adresy.
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  // Slovenské aj zahraničné čísla, s medzerami aj bez nich.
  var PHONE_RE = /^\+?[\d\s()/-]{9,20}$/;

  function fieldWrapper(input) {
    return input.closest('.field') || input.parentElement;
  }

  /**
   * Pripojí alebo odpojí id chybového textu v aria-describedby.
   * Bez toho čítačka obrazovky oznámi „neplatné", ale dôvod nepovie.
   */
  function describedBy(input, errorId, attach) {
    var current = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    var index = current.indexOf(errorId);
    if (attach && index === -1) current.push(errorId);
    if (!attach && index > -1) current.splice(index, 1);
    if (current.length) input.setAttribute('aria-describedby', current.join(' '));
    else input.removeAttribute('aria-describedby');
  }

  function showError(input, message) {
    var wrap = fieldWrapper(input);
    var errorEl = form.querySelector('[data-error-for="' + input.id + '"]');
    if (wrap) wrap.classList.add('is-invalid');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.hidden = false;
      if (errorEl.id) describedBy(input, errorEl.id, true);
    }
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    var wrap = fieldWrapper(input);
    var errorEl = form.querySelector('[data-error-for="' + input.id + '"]');
    if (wrap) wrap.classList.remove('is-invalid');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
      if (errorEl.id) describedBy(input, errorEl.id, false);
    }
    input.removeAttribute('aria-invalid');
  }

  function val(name) {
    var el = form.elements[name];
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  }

  /** Vráti pole neplatných vstupov. Prvý z nich dostane fokus. */
  function validate() {
    var invalid = [];

    // Povinné textové polia
    ['meno', 'mesto', 'sprava', 'typPoziadavky'].forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      clearError(el);
      if (el.hasAttribute('required') && !val(name)) {
        showError(el, messages.required);
        invalid.push(el);
      }
    });

    // Popis požiadavky má mať aspoň nejakú výpovednú hodnotu.
    var sprava = form.elements.sprava;
    if (sprava && val('sprava') && val('sprava').length < 10) {
      showError(sprava, messages.short);
      invalid.push(sprava);
    }

    // Aspoň jeden kontakt.
    var telefon = form.elements.telefon;
    var email = form.elements.email;
    if (telefon && email) {
      clearError(telefon);
      clearError(email);

      if (!val('telefon') && !val('email')) {
        showError(telefon, messages.contact);
        invalid.push(telefon);
      } else {
        if (val('email') && !EMAIL_RE.test(val('email'))) {
          showError(email, messages.email);
          invalid.push(email);
        }
        if (val('telefon') && !PHONE_RE.test(val('telefon'))) {
          showError(telefon, messages.phone);
          invalid.push(telefon);
        }
      }
    }

    // Počet výťahov — ak je vyplnený, musí byť kladné číslo.
    var pocet = form.elements.pocetVytahov;
    if (pocet) {
      clearError(pocet);
      if (val('pocetVytahov') && !(Number(val('pocetVytahov')) > 0)) {
        showError(pocet, messages.number);
        invalid.push(pocet);
      }
    }

    // Súhlas so spracovaním. Ide rovnakou cestou ako ostatné polia,
    // takže dostane aria-invalid aj prepojenie na text chyby.
    var suhlas = form.elements.suhlas;
    if (suhlas) {
      clearError(suhlas);
      if (!suhlas.checked) {
        showError(suhlas, messages.consent);
        invalid.push(suhlas);
      }
    }

    // Prílohy — počet, veľkosť a typ.
    var files = form.elements.prilohy;
    if (files && files.files && files.files.length) {
      clearError(files);
      var attachError = validateFiles(files.files);
      if (attachError) {
        showError(files, attachError);
        invalid.push(files);
      }
    }

    return invalid;
  }

  // Chyba zmizne hneď, ako ju používateľ opraví — nie až po ďalšom odoslaní.
  form.addEventListener(
    'input',
    function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true') clearError(e.target);
    },
    true
  );

  /* ================================================================
     PAYLOAD
     ================================================================ */

  var MAX_FILES = 3;
  var MAX_FILE_BYTES = 2 * 1024 * 1024;
  var MAX_TOTAL_BYTES = 3 * 1024 * 1024;

  function validateFiles(list) {
    if (list.length > MAX_FILES) return 'Naraz sa dajú priložiť najviac ' + MAX_FILES + ' súbory.';
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].size > MAX_FILE_BYTES) {
        return 'Súbor „' + list[i].name + '" je väčší než 2 MB.';
      }
      total += list[i].size;
    }
    if (total > MAX_TOTAL_BYTES) return 'Prílohy spolu presahujú 3 MB.';
    return null;
  }

  /** Súbor → base64 bez dátovej hlavičky, aby ho vedel prijať Resend. */
  function readAsBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = String(reader.result || '');
        resolve({
          name: file.name,
          type: file.type,
          content: result.slice(result.indexOf(',') + 1),
        });
      };
      reader.onerror = function () {
        reject(new Error('read_failed'));
      };
      reader.readAsDataURL(file);
    });
  }

  function collect() {
    var data = {};
    var honeypot = form.dataset.honeypot;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.type === 'submit' || el.type === 'file') return;
      if (honeypot && el.name === honeypot) return;
      data[el.name] = el.type === 'checkbox' ? el.checked : el.value.trim();
    });

    data._kontext = form.dataset.context || 'dopyt';
    // Čas vyplnenia — server ho použije ako druhú, hrubú antispam poistku.
    data._cas = Math.round((Date.now() - mountedAt) / 1000);
    data._stranka = window.location.pathname;
    data._odoslane = new Date().toISOString();
    return data;
  }

  /* ================================================================
     TRANSPORTY
     ================================================================ */

  var transports = {
    json: function (endpoint, data) {
      return fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      }).then(function (res) {
        if (res.ok) return res;
        /* Server vracia dôvod zlyhania, aby sme používateľovi vedeli
           povedať niečo konkrétnejšie než „nepodarilo sa". */
        return res
          .json()
          .catch(function () {
            return {};
          })
          .then(function (payload) {
            var err = new Error('HTTP ' + res.status);
            err.code = payload.error || String(res.status);
            throw err;
          });
      });
    },

    formdata: function (endpoint, data) {
      var fd = new FormData();
      Object.keys(data).forEach(function (k) {
        fd.append(k, data[k]);
      });

      // Prílohy sa posielajú len tam, kde ich backend prijíma.
      var fileInput = form.querySelector('input[type="file"]');
      if (fileInput && fileInput.files) {
        Array.prototype.forEach.call(fileInput.files, function (file) {
          fd.append('prilohy[]', file, file.name);
        });
      }

      return fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }).then(
        function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res;
        }
      );
    },

    mailto: function (endpoint, data) {
      var lines = Object.keys(data)
        .filter(function (k) {
          return k.charAt(0) !== '_' && data[k] !== '' && data[k] !== false;
        })
        .map(function (k) {
          return k + ': ' + data[k];
        });

      window.location.href =
        'mailto:' +
        endpoint +
        '?subject=' +
        encodeURIComponent('Dopyt z webu — ' + (data.mesto || '')) +
        '&body=' +
        encodeURIComponent(lines.join('\n'));

      return Promise.resolve();
    },
  };

  /* ================================================================
     STAVY
     ================================================================ */

  /**
   * POZOR: `html` musí zostať výhradne autorský reťazec z tohto súboru.
   * Nikdy sem nevkladaj hodnotu z formulára ani z URL — bol by to XSS.
   * Ak treba zobraziť vstup používateľa, použi textContent.
   */
  function setStatus(type, html) {
    if (!statusEl) return;
    statusEl.className = 'form__status form__status--' + type;
    statusEl.innerHTML = html;
    statusEl.hidden = false;   // pre istotu, ak by prišlo staršie HTML
  }

  function setBusy(busy) {
    if (!submitBtn) return;
    submitBtn.setAttribute('aria-busy', String(busy));
    submitBtn.disabled = busy;
    var label = submitBtn.querySelector('span');
    if (label) {
      if (busy) {
        submitBtn.dataset.label = label.textContent;
        label.textContent = 'Odosielam…';
      } else if (submitBtn.dataset.label) {
        label.textContent = submitBtn.dataset.label;
      }
    }
  }

  /* ================================================================
     ODOSLANIE
     ================================================================ */

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var invalid = validate();
    if (invalid.length) {
      setStatus(
        'error',
        '<strong>Formulár sa nedá odoslať.</strong> Skontrolujte označené polia — je ich ' +
          invalid.length +
          '.'
      );
      invalid[0].focus();
      return;
    }

    // Antispam: honeypot a minimálny čas vyplnenia.
    var honeypotEl = form.querySelector('.hp input');
    var tooFast = (Date.now() - mountedAt) / 1000 < Number(form.dataset.minFill || 0);
    if ((honeypotEl && honeypotEl.value) || tooFast) {
      setStatus('error', 'Odoslanie sa nepodarilo. Skúste to, prosím, znova.');
      return;
    }

    var transportName = form.dataset.transport;
    var endpoint = form.dataset.endpoint;

    // Backend zatiaľ nie je napojený. Nepredstierame odoslanie.
    if (!transportName || transportName === 'none' || !transports[transportName]) {
      // Odkazovať na kontaktné údaje má zmysel len vtedy, keď na webe sú.
      var hasContact = form.dataset.hasContact === 'true';
      setStatus(
        'info',
        '<strong>Formulár zatiaľ nie je napojený na odosielanie.</strong> ' +
          'Ide o náhľadovú verziu webu — vaša správa sa neodoslala.' +
          (hasContact ? ' Použite, prosím, kontaktné údaje na stránke.' : '')
      );
      return;
    }

    setBusy(true);

    var payload = collect();
    var fileInput = form.elements.prilohy;
    var filesReady =
      fileInput && fileInput.files && fileInput.files.length
        ? Promise.all(Array.prototype.map.call(fileInput.files, readAsBase64)).then(function (list) {
            payload.prilohy = list;
          })
        : Promise.resolve();

    filesReady
      .then(function () {
        return transports[transportName](endpoint, payload);
      })
      .then(function () {
        form.reset();
        setStatus(
          'success',
          '<strong>Dopyt sme prijali.</strong> Ozveme sa na kontakt, ktorý ste uviedli.'
        );
        if (form.dataset.successRedirect) {
          window.location.href = form.dataset.successRedirect;
        }
      })
      .catch(function (err) {
        var code = err && err.code;

        // Kódy zo servera. Server kontroluje prílohy ešte raz — podľa
        // obsahu súboru, nie podľa prípony — takže sem sa dá dostať aj
        // vtedy, keď kontrola v prehliadači prešla.
        var MESSAGES = {
          rate_limited:
            '<strong>Príliš veľa pokusov.</strong> Skúste to znova o minútu.',
          not_configured:
            '<strong>Odosielanie dopytov je momentálne nedostupné.</strong> ' +
            'Kontaktujte nás, prosím, priamo telefonicky alebo e-mailom.',
          validation_failed:
            '<strong>Niektoré údaje sa nedali spracovať.</strong> ' +
            'Skontrolujte, prosím, vyplnené polia.',
          too_many_files:
            '<strong>Priložili ste priveľa súborov.</strong> ' +
            'Naraz sa dajú poslať najviac ' + MAX_FILES + ' súbory.',
          attachment_too_large:
            '<strong>Jedna z príloh je väčšia než 2 MB.</strong> ' +
            'Zmenšite ju, prosím, a skúste to znova.',
          attachments_too_large:
            '<strong>Prílohy spolu presahujú 3 MB.</strong> ' +
            'Pošlite, prosím, menej súborov alebo ich zmenšite.',
          attachment_type:
            '<strong>Jednu z príloh sme nevedeli prijať.</strong> ' +
            'Prijímame fotografie (JPG, PNG, WebP) a súbory PDF.',
          invalid_attachment:
            '<strong>Jednu z príloh sa nepodarilo načítať.</strong> ' +
            'Skúste ju, prosím, priložiť znova.',
        };

        var message =
          MESSAGES[code] ||
          '<strong>Dopyt sa nepodarilo odoslať.</strong> ' +
            'Skúste to o chvíľu znova alebo nás kontaktujte priamo.';

        setStatus('error', message);
      })
      .then(function () {
        setBusy(false);
      });
  });
})();
