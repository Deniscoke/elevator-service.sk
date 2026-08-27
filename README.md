# ELEVÁTOR SERVIS, s.r.o. — web

Statický firemný web pre servis, opravy a modernizáciu výťahov
v Banskej Bystrici a okolí.

**HTML + CSS + vanilla JavaScript.** Žiadny React, Next.js ani Vue.
Build beží na čistom Node bez jedinej závislosti.

---

## Rýchly štart

```bash
npm run dev
```

Zbuilduje web a spustí náhľad na `http://localhost:4173`.

| Príkaz | Čo robí |
|---|---|
| `npm run build` | Náhľadový build → `dist/`. Chýbajúce údaje hlási ako varovania. |
| `npm run build:prod` | Produkčný build. **Zlyhá**, ak chýbajú kritické údaje. |
| `npm run check` | Kontrola pripravenosti bez zápisu na disk. |
| `npm run dev` | Build + lokálny náhľad. |
| `npm run serve` | Len náhľad už zbuildovaného `dist/`. |

Výstup v `dist/` sa dá nahrať kamkoľvek — Vercel, Netlify, Cloudflare Pages
aj klasický FTP hosting. Viď [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Stav projektu

Fáza 1. Web je hotový po stránke štruktúry, obsahu, dizajnu a SEO.
Čaká sa na údaje z discovery formulára klienta.

**Kým údaj nemáme, nezobrazuje sa.** Nikde na webe nie je vymyslené číslo,
falošná referencia, nepotvrdená dostupnosť ani zástupný text.

Aktuálny zoznam:
- [docs/MISSING_DATA.md](docs/MISSING_DATA.md) — čo treba od klienta
- [docs/BUILD_REPORT.md](docs/BUILD_REPORT.md) — generuje build, čo je skryté a prečo
- [docs/EXPERT_VERIFICATION.md](docs/EXPERT_VERIFICATION.md) — technické tvrdenia na overenie

---

## Kde čo zmeniť

| Chcem zmeniť | Súbor |
|---|---|
| Telefón, e-mail, adresu, IČO | `data/company.js` |
| Havarijné číslo a režim služby | `data/company.js` → `emergency` |
| Servisnú oblasť | `data/locations.js` |
| Text služby | `src/pages/<sluzba>.js` |
| SEO title a description služby | `data/services.js` |
| Otázky a odpovede | `data/faq.js` |
| Referencie | `data/references.js` |
| Pracovné pozície | `data/careers.js` |
| Napojenie formulára | `data/forms.js` |
| Farby, písma, medzery | `src/styles/01-tokens.css` |

Po každej zmene: `npm run build`.

---

## Štruktúra webu

```
/                              domovská stránka
/servis-vytahov/               pravidelný servis a údržba
/opravy-vytahov/               opravy a výmena dielov
/odborne-prehliadky-a-skusky/  prehliadky a skúšky
/modernizacia-vytahov/         modernizácia a rekonštrukcia
/havarijna-sluzba/             havarijná služba a postup pri uviaznutí
/o-nas/
/referencie/
/kariera/
/kontakt/                      dopytový formulár
/poradna/
/ochrana-osobnych-udajov/
404.html
```

Lokalitné stránky (Zvolen, Brezno, Žiar nad Hronom, Detva) sú pripravené
v `data/locations.js`, ale **nepublikované** — vzniknú, až keď k nim
bude reálny obsah.

---

## Ako je to postavené

Podrobne v [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). V skratke:

- **`data/`** je jediný zdroj pravdy. `null` znamená „údaj nemáme"
  a komponent sa nevykreslí.
- **`src/`** obsahuje šablóny a stránky. Stránka je funkcia, ktorá vracia string.
- **`build.mjs`** poskladá `dist/` a zároveň skontroluje odkazy, SEO metadáta
  a presakovanie zástupných hodnôt.
- **`static/`** sa kopíruje 1:1 (2 JS súbory, favicon, manifest).

Celý SEO obsah je v HTML. JavaScript nič nedogeneruje — bez neho
je web plne čitateľný.

---

## Prístupnosť a výkon

- semantické HTML, jeden `H1` na stránku, drobčeková navigácia
- skip link, viditeľný fokus, pasca fokusu v mobilnom menu
- dotykové ciele min. 44 px, veľkosť písma v poliach 16 px (bez zoomu na iOS)
- žiadne externé fonty, skripty ani sledovacie nástroje
- jeden CSS súbor, dva malé JS súbory, obe `defer`
- `prefers-reduced-motion` sa rešpektuje globálne
- bez horizontálneho scrollu od 320 px vyššie
