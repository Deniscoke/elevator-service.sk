# Architektúra projektu

Statický web bez frontend frameworku. Výstupom je obyčajné HTML, CSS a vanilla JS.

---

## 1. Prečo build script a nie ručne písané HTML

Zadanie požaduje viacstránkový statický web **a zároveň** centralizovanú
dátovú vrstvu. To sú protichodné požiadavky: čisté HTML nevie zdieľať dáta
medzi stránkami bez toho, aby sa telefónne číslo napísalo na dvadsať miest.

Riešením je **build-time generovanie bez závislostí**:

```
data/ + src/  ──[ node build.mjs ]──►  dist/
(zdroj)                                (statické HTML/CSS/JS)
```

- žiadny runtime framework — v prehliadači nebeží nič okrem 2 malých skriptov
- žiadne `node_modules` — build používa iba štandardnú knižnicu Node
- `dist/` je obyčajný priečinok, ktorý sa dá nahrať na akýkoľvek hosting

Zmena telefónneho čísla = jedna hodnota v `data/company.js` + `npm run build`.

---

## 2. Štruktúra súborov

```
elevetorservis.sk/
├── build.mjs               generátor (bez závislostí)
├── serve.mjs               lokálny náhľadový server
├── package.json
│
├── data/                   JEDINÝ ZDROJ PRAVDY
│   ├── company.js          firemné údaje, kontakty, čísla, identita
│   ├── services.js         služby, ich URL a SEO metadáta
│   ├── locations.js        servisná oblasť, plánované lokality
│   ├── references.js       realizácie + segmenty zákazníkov
│   ├── careers.js          pracovné pozície, benefity
│   ├── content.js          editoriálne bloky (problémy, postupy)
│   ├── faq.js              otázky a odpovede
│   ├── articles.js         poradňa
│   └── forms.js            konfigurácia a napojenie formulára
│
├── src/
│   ├── lib/
│   │   ├── html.js         escapovanie, isSet(), when(), map()
│   │   ├── icons.js        inline SVG ikony
│   │   ├── seo.js          meta tagy, OpenGraph, JSON-LD
│   │   ├── layout.js       HTML shell, hlavička, pätička, sticky lišta
│   │   ├── components.js   znovupoužiteľné sekcie
│   │   ├── form.js         markup dopytového formulára
│   │   └── service-page.js spoločná šablóna stránky služby
│   ├── pages/              13 stránok, každá je modul
│   └── styles/             6 CSS vrstiev → 1 súbor
│
├── static/                 kopíruje sa 1:1 do dist/
│   ├── js/site.js          menu, reveal, sticky lišta
│   ├── js/form.js          validácia a odoslanie
│   ├── assets/             favicon, OG obrázok
│   └── site.webmanifest
│
├── docs/                   MISSING_DATA, EXPERT_VERIFICATION, BUILD_REPORT
└── dist/                   ⚠ generované — needitovať
```

---

## 3. Dátová vrstva — pravidlo `null`

Toto je nosná myšlienka celého projektu.

```js
contact: {
  phone: null,   // údaj nemáme
}
```

`null` nie je chyba. Je to **stav**, ktorý sa prenáša až do renderovania:

```js
when(isSet(company.contact.phone), () => `<a href="tel:...">…</a>`)
```

Keby sme použili prázdny reťazec alebo zástupnú hodnotu (`"+421 XXX"`),
vznikol by odkaz do prázdna alebo falošný údaj. S `null` sa komponent
**vôbec nevygeneruje** a build zapíše dôvod do `docs/BUILD_REPORT.md`.

### Dôsledky v praxi

| Chýbajúci údaj | Čo sa stane |
|---|---|
| `contact.phone` | Zmizne telefón v hlavičke, pätičke aj sticky lište. Lišta má jedno tlačidlo cez celú šírku. |
| `contact.emergencyPhone` | Havarijná sekcia zostane, ale namiesto čísla ponúkne postup pri uviaznutí. |
| `address.street` | Negeneruje sa `LocalBusiness` schéma ani adresa v pätičke. |
| `stats.*` | Trust layer sa nevykreslí (potrebuje ≥ 2 overené údaje). |
| `references[]` | Sekcia referencií sa preskočí, na `/referencie/` ostane neutrálny stav. |
| `positions[]` | Kariérna stránka povie pravdivo, že pozíciu nemáme. |

---

## 4. CSS architektúra

Šesť vrstiev, ktoré build zreťazí do jedného `css/main.css`:

| Vrstva | Obsah |
|---|---|
| `01-tokens.css` | **jediné** miesto s hodnotami — farby, spacing, typografia, tiene |
| `02-base.css` | reset, typografia, fokus, prístupnostné pomôcky |
| `03-layout.css` | kontajnery, sekcie, hlavička, pätička, sticky lišta |
| `04-components.css` | tlačidlá, hero, karty, akordeón, akvizičná sekcia… |
| `05-forms.css` | formulárové polia, stavy, validácia |
| `06-utilities.css` | reveal animácie, utility, tlač |

Jeden HTTP request, žiadny `@import` reťazec, žiadny build nástroj.
V produkcii sa odstránia komentáre a odsadenie; zvyšok vyrieši gzip.

Farby vychádzajú zo značky: žltá `#FFC61A` z loga a grafit `#12161C`.
Po dodaní presných firemných farieb sa mení iba `01-tokens.css`.

**Tmavé sekcie** používajú triedu `.on-dark`, ktorá lokálne prepne tokeny
(`--text`, `--border`, `--accent-text`…). Potomkovia sa prispôsobia sami,
takže žiadne pravidlo netreba písať dvakrát. Pozadie berie zo samostatného
tokenu `--surface-dark` — `--ink-900` je vnútri `.on-dark` prepísaná na bielu
a pozadie by z nej vyšlo biele.

---

## 5. JavaScript architektúra

Dva súbory, oba `defer`, oba nepovinné pre zobrazenie obsahu.

**`site.js`** (~5 kB) — mobilné menu s pascou fokusu, panel služieb v hlavičke,
stav hlavičky pri scrollovaní, sticky lišta, reveal animácie,
predvyplnenie typu dopytu z URL (`/kontakt/?typ=oprava`).

**`form.js`** (~7 kB, len na kontakte) — validácia, antispam, transport.

Čo v JavaScripte **zámerne nie je**:
- FAQ akordeón → natívny `<details>`, funguje bez JS
- generovanie obsahu → celý SEO obsah je v HTML
- knižnice → žiadne

### Poistky proti prázdnej stránke

Reveal animácie skrývajú obsah cez `opacity: 0`. To je nebezpečné —
ak by JS zlyhal, návštevník uvidí prázdnu stránku. Preto:

1. `opacity: 0` platí len pri triede `.js` na `<html>`, ktorú nastaví inline skript.
2. Obsah nad ohybom sa odhalí okamžite podľa `getBoundingClientRect()`,
   nečaká sa na `IntersectionObserver`.
3. Ak sa do 2 sekúnd neodhalí nič, skript zobrazí všetko naraz.

---

## 6. Formulár a jeho napojenie

Formulár nevie, kam sa odosiela. Pozná len **transport**:

```js
// data/forms.js
transport: null,   // 'json' | 'formdata' | 'mailto'
endpoint: null,
```

| Transport | Použitie |
|---|---|
| `json` | vlastný endpoint alebo serverless funkcia (Vercel, Netlify, Cloudflare) |
| `formdata` | Formspree, Basin, Netlify Forms — vrátane príloh |
| `mailto` | núdzový režim bez backendu |

Kým je `transport: null`, formulár **validuje, ale nepredstiera odoslanie**.
Používateľ dostane jasnú informáciu. Produkčný build v tomto stave zlyhá,
takže sa web nedá spustiť s mŕtvym formulárom.

Antispam: honeypot pole + minimálny čas vyplnenia. Žiadna CAPTCHA,
žiadna externá služba, žiadne sledovanie.

---

## 7. SEO architektúra

- `title`, `description`, `canonical`, OpenGraph — generuje `src/lib/seo.js`
- `sitemap.xml` a `robots.txt` — generuje build z registra stránok
- JSON-LD v jednom `@graph`: `Organization`, `WebSite`, `LocalBusiness`,
  `Service`, `BreadcrumbList`, `FAQPage`
- každý JSON-LD prechádza cez `pruneEmpty()` — z grafu vypadne každá
  prázdna vetva, takže schéma nikdy neobsahuje vymyslený údaj

Lokalitné stránky (Zvolen, Brezno…) sú **pripravené, ale nepublikované**.
Doorway stránky bez reálneho obsahu by uškodili viac, než pomohli.

---

## 8. Kontroly v builde

Build nie je len generátor. Je to aj kontrolór:

| Kontrola | Čo hľadá |
|---|---|
| Presakovanie zástupných hodnôt | `lorem ipsum`, `TODO`, `John Doe`, `24/7`, `null`, `undefined`, interné poznámky |
| Interné odkazy | odkaz na neexistujúcu stránku alebo súbor |
| SEO metadáta | chýbajúci/dlhý title, duplicity, počet `H1` |
| Pripravenosť na produkciu | kritické údaje z `data/company.js`, napojenie formulára, doména, logo |

Náhľadový build ich hlási ako varovania, produkčný (`--prod`) ako chyby.

---

## 9. Ako pridať novú stránku

1. Vytvor `src/pages/nova-stranka.js` s `export default function page(ctx)`.
2. Vráť objekt: `{ path, title, description, crumbs, schemas, main }`.
3. Zaregistruj modul v `build.mjs` v poli `PAGES`.

Sitemap, drobčeková navigácia, kontrola odkazov aj SEO kontrola sa aplikujú automaticky.
