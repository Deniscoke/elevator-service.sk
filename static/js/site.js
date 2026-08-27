/**
 * site.js — interakcie webu ELEVÁTOR SERVIS
 *
 * Rozpočet na JavaScript je zámerne malý. Platí pravidlo:
 * JS smie pridať funkciu alebo výrazne zlepšiť UX, nesmie byť podmienkou
 * zobrazenia obsahu. Všetko nižšie je progressive enhancement.
 *
 * FAQ accordion tu zámerne NIE JE — používame natívny <details>,
 * ktorý funguje bez JavaScriptu a je prístupný z klávesnice.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================================================================
     MOBILNÉ MENU
     ================================================================ */

  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (burger && menu) {
    var panel = menu.querySelector('.mobile-menu__panel');
    var lastFocused = null;

    var focusableSelector =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    var lockedAt = 0;

    /**
     * Zamknutie scrollu pod otvoreným menu.
     * `overflow: hidden` na <body> na iOS Safari nestačí — stránka sa pod
     * prekrytím scrolluje ďalej. Spoľahlivé je `position: fixed`, ale to
     * skočí na začiatok stránky, takže si pozíciu musíme zapamätať a vrátiť.
     */
    function lockScroll() {
      lockedAt = window.scrollY;
      document.body.style.top = -lockedAt + 'px';
      document.body.classList.add('is-locked');
    }

    function unlockScroll() {
      /* Stránka má scroll-behavior: smooth, takže by sa aj návrat na pôvodné
         miesto animoval — používateľ by po zavretí menu sledoval, ako sa
         stránka niekam plazí. Obnovenie pozície musí byť okamžité. */
      var root = document.documentElement;
      var previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';

      document.body.classList.remove('is-locked');
      document.body.style.top = '';
      window.scrollTo(0, lockedAt);

      root.style.scrollBehavior = previousBehavior;
    }

    function openMenu() {
      lastFocused = document.activeElement;
      menu.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Zavrieť menu');
      lockScroll();
      var first = panel.querySelector(focusableSelector);
      if (first) first.focus();
      document.addEventListener('keydown', onMenuKeydown);
    }

    function closeMenu() {
      menu.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Otvoriť menu');
      unlockScroll();
      document.removeEventListener('keydown', onMenuKeydown);
      if (lastFocused) lastFocused.focus();
    }

    /**
     * Escape zatvára, Tab drží fokus vnútri panelu.
     * Bez tejto pasce by sa dal klávesnicou „vytabovať" pod prekrytie,
     * čo je pre používateľov čítačiek obrazovky mätúce.
     */
    function onMenuKeydown(e) {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;

      var items = Array.prototype.filter.call(
        panel.querySelectorAll(focusableSelector),
        function (el) {
          return el.offsetParent !== null;
        }
      );
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    burger.addEventListener('click', function () {
      menu.hidden ? openMenu() : closeMenu();
    });

    menu.addEventListener('click', function (e) {
      if (e.target === menu || e.target.closest('[data-menu-close]')) closeMenu();
    });

    // Po kliknutí na odkaz sa menu zatvorí, inak zostane prekryté nad novou stránkou.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a[href]')) closeMenu();
    });
  }

  /* ================================================================
     PANEL SLUŽIEB V HLAVIČKE
     ================================================================ */

  var navToggle = document.querySelector('.nav__toggle');
  var navPanel = navToggle && document.getElementById(navToggle.getAttribute('aria-controls'));

  if (navToggle && navPanel) {
    var closeTimer = null;

    function setPanel(open) {
      navPanel.hidden = !open;
      navToggle.setAttribute('aria-expanded', String(open));
    }

    navToggle.addEventListener('click', function () {
      setPanel(navPanel.hidden);
    });

    // Otvorenie hoverom je pohodlné pre myš, ale nesmie nahradiť klik.
    var wrapper = navToggle.closest('.nav__item--has-panel');
    wrapper.addEventListener('mouseenter', function () {
      clearTimeout(closeTimer);
      setPanel(true);
    });
    wrapper.addEventListener('mouseleave', function () {
      closeTimer = setTimeout(function () {
        setPanel(false);
      }, 160);
    });

    document.addEventListener('click', function (e) {
      if (!wrapper.contains(e.target)) setPanel(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !navPanel.hidden) {
        setPanel(false);
        navToggle.focus();
      }
    });

    // Fokus mimo panelu ho zatvorí — dôležité pri prechode klávesnicou.
    wrapper.addEventListener('focusout', function (e) {
      if (!wrapper.contains(e.relatedTarget)) setPanel(false);
    });
  }

  /* ================================================================
     HLAVIČKA A STICKY LIŠTA PRI SCROLLOVANÍ
     ================================================================ */

  var header = document.querySelector('[data-header]');
  var stickyBar = document.querySelector('[data-sticky-bar]');

  if (stickyBar) {
    // Pätička potrebuje vedieť, koľko miesta si lišta berie.
    var setBarHeight = function () {
      document.documentElement.style.setProperty(
        '--sticky-bar-h',
        stickyBar.offsetHeight + 'px'
      );
    };
    setBarHeight();
    window.addEventListener('resize', setBarHeight, { passive: true });
  }

  if (header || stickyBar) {
    var ticking = false;

    function onScroll() {
      var y = window.scrollY;

      if (header) header.classList.toggle('is-scrolled', y > 8);

      if (stickyBar) {
        /* Lišta sa objaví, keď používateľ prejde úvodnú obrazovku,
           a potom zostane. Pôvodne sa skrývala pri scrollovaní nadol —
           lenže nadol sa scrolluje väčšinu času, takže hlavné CTA
           nebolo vidieť práve vtedy, keď ho človek číta. */
        stickyBar.classList.toggle('is-visible', y > Math.min(window.innerHeight * 0.6, 400));
      }


      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );

    onScroll();
  }

  /* ================================================================
     REVEAL PRI SCROLLOVANÍ
     ================================================================ */

  var revealables = document.querySelectorAll('[data-reveal]');

  function revealAll() {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-visible');
    });
  }

  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      // Bez podpory alebo pri vypnutých animáciách zobrazíme všetko naraz.
      revealAll();
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
      );

      var viewportH = window.innerHeight || 0;

      Array.prototype.forEach.call(revealables, function (el, i) {
        // Jemné kaskádovanie v rámci jednej mriežky.
        if (el.getAttribute('data-reveal') === 'stagger') {
          el.style.setProperty('--reveal-delay', Math.min(i % 6, 5) * 60 + 'ms');
        }

        /* POISTKA 1 — obsah nad ohybom sa zobrazí okamžite.
           Nečakáme naň na observer: keby sa callback nespustil (skrytý tab,
           prerender, netypický prehliadač), zostal by hero prázdny. */
        if (el.getBoundingClientRect().top < viewportH) {
          el.classList.add('is-visible');
          return;
        }

        observer.observe(el);
      });

      /* POISTKA 2 — ak sa do 2 sekúnd nič neodhalilo, observer zjavne
         nefunguje. Radšej zobrazíme všetko bez animácie, než aby si
         niekto pozeral prázdnu stránku. */
      window.setTimeout(function () {
        if (!document.querySelector('[data-reveal].is-visible')) revealAll();
      }, 2000);
    }
  }

  /* ================================================================
     PREDVYPLNENIE TYPU DOPYTU Z URL
     /kontakt/?typ=oprava#dopyt
     ================================================================ */

  var params = new URLSearchParams(window.location.search);
  var presetType = params.get('typ');

  if (presetType) {
    var select = document.getElementById('typPoziadavky');
    if (select) {
      var match = Array.prototype.find.call(select.options, function (o) {
        return o.value === presetType;
      });
      if (match) select.value = presetType;
    }
  }
})();
