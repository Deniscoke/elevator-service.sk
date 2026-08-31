# Balík za 800 € — stav dodávky

Klient si záväzne vybral stredný balík **Rast (800 €)**.
Tento dokument je jediný zdroj pravdy o tom, čo je dodané a čo nie.

Podklad: audit projektu z 31. 8. 2026 (6 dimenzií, 148 posúdených položiek).
Údaje na potvrdenie klientom: [CLIENT_DATA_TO_VERIFY.md](./CLIENT_DATA_TO_VERIFY.md).

| Status | Význam |
|---|---|
| **DONE** | Hotové a overené vo vygenerovanom výstupe |
| **PARTIAL** | Funguje, ale niečo chýba do profesionálneho odovzdania |
| **WAITING FOR CLIENT** | Kód je hotový, chýba údaj od klienta |
| **BLOCKED** | Bráni spusteniu |
| **OUT OF SCOPE** | Mimo balíka za 800 € |

---

## 1. Web a obsah

| DELIVERABLE | STATUS | FILE/URL | BLOCKER | NOTES |
|---|---|---|---|---|
| Kompletný responzívny web | DONE | `dist/` — 13 stránok | — | 320–1920 px bez horizontálneho scrollu |
| Custom visual design | DONE | `src/styles/01–07` | — | Vlastný dizajnový systém, žiadny framework |
| Vanilla HTML/CSS/JS architektúra | DONE | `build.mjs` | — | Nula npm závislostí |
| Homepage | DONE | `/` | — | Konverzný flow: problém → služby → akvizícia → postup |
| Service landing pages (5×) | DONE | `/servis-vytahov/` + 4 | — | Jednotná šablóna `src/lib/service-page.js` |
| O nás | DONE | `/o-nas/` | — | Doplnená sekcia „Prečo my" z potvrdených dát |
| Kontakt | DONE | `/kontakt/` | — | Formulár + tmavý kontaktný panel |
| Kariéra | WAITING FOR CLIENT | `/kariera/` | Mzda pri pozíciách | Pozície sa nezverejnia bez mzdy — viď §6 |
| Referenčná architektúra | WAITING FOR CLIENT | `data/references.js` | Súhlasy zákazníkov | 3 referencie pripravené, `consent: false` |
| Poradenská architektúra | DONE | `/poradna/` | — | Rozcestník otázok; články mimo scope |
| Desktop / tablet / mobil | DONE | — | — | Overené na 320/375/430/768/1024/1440/1920 |
| Navigácia a dropdown | DONE | `src/lib/layout.js` | — | Klávesnica, Escape, focus-out |
| CTA a servisný lead funnel | DONE | — | — | Akvizičná sekcia → `/kontakt/?typ=…` |
| 404 | DONE | `/404.html` | — | `noindex`, rozcestník na služby |

## 2. Formulár

| DELIVERABLE | STATUS | FILE/URL | BLOCKER | NOTES |
|---|---|---|---|---|
| Funkčný dopytový formulár | WAITING FOR CLIENT | `api/dopyt.js` | `RESEND_API_KEY` | Pipeline hotový a nasadený; overené 405/503/200 na živom endpointe |
| Serverová validácia | DONE | `api/dopyt.js` | — | Zrkadlí klientsku, kontextovo citlivá |
| Antispam | DONE | honeypot + rate limit + limity dĺžok | — | Bez CAPTCHA a bez sledovania |
| **Prílohy — foto výťahu a štítku** | DONE | `data/forms.js`, `api/dopyt.js` | — | Deliverable balíka Rast |
| **Automatická odpoveď zákazníkovi** | DONE | `api/dopyt.js` | — | Deliverable balíka Rast |
| Čestné správanie pri zlyhaní | DONE | `static/js/form.js` | — | Nikdy nepredstiera úspech |

## 3. SEO

| DELIVERABLE | STATUS | FILE/URL | BLOCKER | NOTES |
|---|---|---|---|---|
| Unique titles | DONE | 13/13 stránok | — | 32–60 znakov, žiadna duplicita |
| Unique meta descriptions | DONE | 13/13 | — | Žiadna duplicita ani orezanie |
| Canonical URL | DONE | `src/lib/seo.js` | — | Apex doména, absolútne |
| Jeden H1 na stránku | DONE | 13/13 | — | Kontrola v builde aj v `qa.mjs` |
| Logická štruktúra H2/H3 | DONE | — | — | Bez preskočených úrovní |
| Interné prelinkovanie | DONE | — | — | Bez nefunkčného odkazu |
| Semantické HTML | DONE | — | — | Landmarky, `role="list"` doplnené |
| sitemap.xml | DONE | `/sitemap.xml` | — | 12 URL, generovaná z registra |
| robots.txt | DONE | `/robots.txt` | — | — |
| Organization schema | WAITING FOR CLIENT | `src/lib/seo.js` | IČO, DIČ, adresa | Vykresľuje sa; polia sa doplnia samy |
| LocalBusiness schema | WAITING FOR CLIENT | `src/lib/seo.js` | Adresa + PSČ | Zámerne sa negeneruje bez adresy |
| Service schema | DONE | 5 stránok služieb | — | — |
| BreadcrumbList | DONE | 11 podstránok | — | — |
| FAQPage | DONE | homepage + 5 služieb | — | — |
| OpenGraph metadata | DONE | `assets/og-default.png` | — | PNG 1200×630 |
| Favicon | DONE | `assets/favicon.svg` | — | — |
| NAP konzistencia | WAITING FOR CLIENT | — | Adresa | Meno a telefón konzistentné všade |

## 4. Nasadenie a doména

| DELIVERABLE | STATUS | FILE/URL | BLOCKER | NOTES |
|---|---|---|---|---|
| Vercel-ready production deployment | DONE | `vercel.json` | — | Nasadené, hash v názvoch assetov |
| Custom doména elevatorservis.sk | WAITING FOR CLIENT | Vercel projekt | DNS u Websupportu | Obe domény pridané; hodnoty v `DEPLOYMENT.md` |
| www → apex presmerovanie | DONE | `vercel.json` → `redirects` | — | 301 na kanonickú doménu |
| Príprava Search Console | DONE | `company.integrations` | ID od klienta | Bez ID sa nevloží nič |
| Príprava analytiky | DONE | `src/lib/seo.js` | Voľba nástroja | Plausible/Umami bez cookies |

## 5. Kvalita

| DELIVERABLE | STATUS | FILE/URL | BLOCKER | NOTES |
|---|---|---|---|---|
| Performance optimization | DONE | — | — | CSS 10,5 kB gzip, JS 3,7 kB, 0 závislostí |
| Accessibility basics | DONE | — | — | Kontrast, klávesnica, `aria-describedby`, focus |
| Finálny QA | DONE | `qa.mjs` + `npm run check` | — | Automatizované, súčasť buildu |

## 6. Čaká na klienta — blokuje spustenie

| ÚDAJ | PREČO BLOKUJE |
|---|---|
| **Ulica a číslo + PSČ** | Povinný údaj; odomkne `LocalBusiness` schému |
| **IČO** | Povinný identifikačný údaj (§ 3a Obchodného zákonníka) |
| **Zápis v obchodnom registri** | Povinný údaj |
| **Logo v elektronickej podobe** | Značka v hlavičke je rekonštrukcia z pečiatky |
| **`RESEND_API_KEY`** | Bez neho formulár neodošle |
| **DNS záznamy u Websupportu** | Bez nich doména neukazuje na Vercel |
| **Mzda pri pracovných pozíciách** | Bez nej sa pozície nezverejnia — § 62 ods. 2 zák. 5/2004 Z. z. |
| **Súhlasy s referenciami** | Bez nich sa sekcia nevykreslí |
| **Doba uchovávania údajov z formulára** | Povinná náležitosť GDPR |

## 7. Mimo balíka za 800 €

Neimplementované a **ďalej sa nerozvíjajú**. Ak niečo z toho existuje ako
pripravená architektúra, zostáva zamrznuté.

| POLOŽKA | STAV V PROJEKTE |
|---|---|
| CMS / admin panel | neexistuje |
| Databáza, zákaznícka zóna, CRM | neexistuje |
| Databáza výťahov | neexistuje |
| Rozsiahly blog / desiatky SEO článkov | `/poradna/` je rozcestník; `data/articles.js` je prázdne a zostáva |
| Masové location pages | `data/locations.js` má 6 miest s `published: false` — zamrznuté |
| Google Ads, dlhodobé SEO, social media | neexistuje |
| Nový brand identity / logo redesign | značka je rekonštrukcia z pečiatky, nie redesign |
| Profesionálne fotografovanie | fotky sú AI ilustračné, na výmenu klientom |
| Marketing automation | neexistuje |
| Recurring maintenance systém | neexistuje |
| Consent vrstva pre GA4 | neexistuje — odporúčaná bezcookie analytika |
| Poradňa: 4 odborné články | **balík Komplet**, nie Rast |
| Lokalitné stránky Zvolen/Brezno | **balík Komplet**, nie Rast |
| Pozície v Google ponukách práce | **balík Komplet**, nie Rast |
| Zaškolenie a písomné odovzdanie | **balík Komplet**, nie Rast |
