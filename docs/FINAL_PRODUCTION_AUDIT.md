# Finálny produkčný audit

Dátum auditu: 4. 9. 2026 · Rozsah: celý projekt pred spustením na
`https://elevatorservis.sk`.

Audit prebehol v 12 nezávislých dimenziách; kritické nálezy boli následne
adversariálne overené (druhý priechod, ktorý sa nález pokúšal vyvrátiť).
Tento dokument je stav **po** zapracovaní opráv.

| Status | Význam |
|---|---|
| **DONE** | Vyriešené a overené vo vygenerovanom výstupe |
| **NEEDS UPDATE** | Nájdené, neopravené — nebráni spusteniu |
| **WAITING FOR CLIENT** | Kód hotový, chýba údaj alebo rozhodnutie klienta |
| **BLOCKED** | Bráni spusteniu |
| **NOT APPLICABLE** | Netýka sa tohto projektu |

---

## 1. Nepotvrdené tvrdenia

| Nález | Status | Poznámka |
|---|---|---|
| „26 rokov na trhu" v trust bare a na /o-nas/ | DONE | `stats.yearsInBusiness: null` — dlaždica sa nevykreslí |
| Differentiator „26 rokov na jednom mieste" s nedokončenou vetou | DONE | Odstránený |
| „Reakcia do jednej hodiny" na /o-nas/ | DONE | `emergency.responseTimeNote: null`, differentiator odstránený |
| „4 odborné oprávnenia" + zoznam § 16/18/22/23 | DONE | `certifications: []` — sekcia sa nevykreslí |
| Homepage: „Aktuálne obsadzujeme 3 pozície" | DONE | Teaser používa rovnakú poistku ako /kariera/ |
| Tri konkrétne pozície ako aktívne hľadanie ľudí | DONE | Vypíšu sa len pri zverejniteľnom inzeráte |
| Benefit „Školenia" a odvodená „Stabilita" | DONE | Odstránené; zostali služobné vozidlo a zaučenie |
| Build gate nekontroloval nepotvrdené tvrdenia | DONE | `conditionalLeakPatterns()` má nové vzory naviazané na dáta |
| Poradňa tvrdí, že otázky sú od reálnych zákazníkov | NEEDS UPDATE | Formulácia je mäkká („bežné otázky"), ale presnejšie by bolo „otázky, ktoré sa opakujú" |
| Referencie, mzdy, hodnotenia, ocenenia, počty zamestnancov | DONE | Bez nálezu — nikde sa nevyskytujú |

## 2. SEO metadáta

| Nález | Status | Poznámka |
|---|---|---|
| Unikátny title, description, jeden H1, canonical na všetkých 13 stranách | DONE | Overené v `dist/` |
| Kanonický host `https://elevatorservis.sk` | DONE | Bez www a bez `*.vercel.app` |
| Kanibalizácia: `/` a `/servis-vytahov/` majú podobný prefix titulu | NEEDS UPDATE | Kozmetika, neblokuje |
| `og:image:alt`, `og:image:width/height`, `twitter:*` navyše | NEEDS UPDATE | Základné OG tagy sú kompletné |
| Meta description `/kariera/` si protirečila s obsahom | DONE | Prepísaná spolu s evergreen obsahom |
| `checkSeo()` nekontroluje canonical ani OG | NEEDS UPDATE | Kontrolu robí `qa.mjs` |
| 404 má self-canonical na `/404.html` | NEEDS UPDATE | Stránka je `noindex`, dopad nulový |

## 3. Štruktúrované dáta

| Nález | Status | Poznámka |
|---|---|---|
| Organization bez adresy | DONE | Adresa sa vypisuje aj bez ulice (mesto, kraj, krajina) |
| LocalBusiness sa nevykresľoval vôbec | DONE | Vykreslí sa, keď je známe mesto; podtyp `HomeAndConstructionBusiness` |
| `areaServed` deklaroval celý kraj | DONE | Zodpovedá viditeľnému textu („Banská Bystrica a okolie do 80 km") |
| Havarijná linka nebola v schéme | DONE | `ContactPoint` typu `emergency`, nonstop |
| JobPosting pre neexistujúce pozície | DONE | Nikdy sa negeneroval; overené v `dist/` |
| Vymyslené `openingHours`, `rating`, `review`, `priceRange`, ocenenia | DONE | Nevyskytujú sa |
| FAQPage duplicitne na dvoch URL | NEEDS UPDATE | Štyri otázky na `/` aj na tematickej stránke |
| `logo` bez rozmerov, `identifier` bez typu | NEEDS UPDATE | Kozmetika |

## 4. Sitemap, robots, doména

| Nález | Status | Poznámka |
|---|---|---|
| Sitemap: absolútne URL, iba kanonické, bez vercel.app a www | DONE | 12 URL |
| robots.txt neblokuje CSS/JS/obrázky, odkazuje na sitemap | DONE | — |
| `lastmod` = dátum buildu pre všetky URL | NEEDS UPDATE | Údaj je neudržateľný; zvážiť odstránenie |
| Kontrola domény v builde prepustila www aj `*.vercel.app` | NEEDS UPDATE | `SITE_URL` je nastavená správne, kontrola je len voľnejšia, než by mala byť |
| Duplicitný Vercel projekt servíruje indexovateľnú kópiu | WAITING FOR CLIENT | Git integrácia je odpojená a produkcia je overená — projekt `prj_EHZFtnwy1stspQ98meUwRRL2GgFq` je možné bezpečne ručne zmazať. Z kódu sa nemení nič. |
| `localhost` / `127.0.0.1` v repozitári | DONE | Iba `serve.mjs` — legitímny vývojový nástroj |

## 5. Kariéra a právna presnosť

| Nález | Status | Poznámka |
|---|---|---|
| Tvrdenie o počte otvorených pozícií | DONE | Odstránené z homepage aj z /kariera/ |
| Mzdy | DONE | Nikde sa nepublikujú (§ 62 ods. 2 zák. 5/2004 Z. z.) |
| Preplácanie školení a certifikácií | DONE | Nikde sa netvrdí |
| Kvalifikácia revízneho technika | DONE | Znenie viazané na vyhlášku 508/2009 Z. z., § 16 a prílohu č. 11 bez zovšeobecnení; zdroje v `LEGAL_CONTENT_SOURCES.md` |
| Požiadavky podľa § 18 stotožnené s § 16 | DONE | Netvrdí sa |
| JobPosting JSON-LD | DONE | Negeneruje sa |

## 6. GDPR

| Nález | Status | Poznámka |
|---|---|---|
| Chýbala doba uchovávania | DONE | 2 roky od poslednej komunikácie, výslovne ako **interné pravidlo firmy**, nie zákonná lehota |
| Prevádzkovateľ bez IČO, sídla a zápisu | DONE | Doplnené 4. 9. 2026 z verejného obchodného registra |
| Vynútený súhlas ako právny základ bežného dopytu | DONE | Políčko je potvrdenie o oboznámení, nie súhlas; právnym základom sú predzmluvné opatrenia. Odporúčané finálne právne posúdenie znenia. |
| Kariérne dopyty nie sú v informačnej povinnosti opísané | NEEDS UPDATE | Formulár na /kariera/ posiela rovnaké údaje |
| Chýba doložka o zákonnosti spracúvania pred odvolaním súhlasu | NEEDS UPDATE | Súvisí s právnym posúdením vyššie |
| Dozorný orgán nie je pomenovaný | NEEDS UPDATE | Uvedené je len „dozorný orgán" |
| „IP adresa sa nikam neukladá" | NEEDS UPDATE | Tvrdenie je absolútne; hosting vedie prevádzkové logy |

## 7. Formulár a jeho bezpečnosť

| Nález | Status | Poznámka |
|---|---|---|
| CRLF injection do predmetu e-mailu cez pole „mesto" | DONE | `stripControl()` — pokryté testom |
| Hodnoty selectov sa nevalidovali proti zoznamu | DONE | Validácia proti `data/services.js` — pokryté testom |
| Čas vyplnenia sa na serveri nekontroloval | DONE | Kontroluje sa; hodnotu hlási klient, preto je označená ako best-effort |
| Typ prílohy podľa obsahu, nie podľa prípony | DONE | Magic bytes, prípona sa vynucuje z obsahu |
| Limity počtu a veľkosti príloh (server aj klient) | DONE | 3 súbory / 2 MB / 3 MB spolu |
| Rate limit | DONE (dokumentačne) | In-memory per inštancia — opísaný ako best-effort, nie distribuovaný |
| Escapovanie HTML, žiadny únik tajomstiev | DONE | Potvrdenie zákazníkovi neobsahuje žiadny vstup od používateľa |
| Testovací súbor v `api/` | DONE | Presunutý do `test/`; v `api/` je jediná funkcia `dopyt.js` |
| Limity príloh natvrdo v klientovi | NEEDS UPDATE | Duplicita voči `data/forms.js` |

## 8. Prístupnosť

| Nález | Status | Poznámka |
|---|---|---|
| Stavová správa formulára sa neoznámila čítačke obrazovky | DONE | Živá oblasť je v strome od načítania, prázdna sa skrýva cez CSS |
| Kontrast obrysu polí 1,58 : 1 | NEEDS UPDATE | WCAG 2.1 SC 1.4.11 vyžaduje 3 : 1 |
| Panel „Služby" sa po ťuknutí zatvára | NEEDS UPDATE | Na dotykových zariadeniach |
| Fokus po odblokovaní tlačidla | NEEDS UPDATE | — |
| Skip-link, popisky polí, sémantika, `prefers-reduced-motion` | DONE | — |

## 9. Výkon a Core Web Vitals

| Nález | Status | Poznámka |
|---|---|---|
| LCP obsah skrytý cez `opacity: 0` do spustenia skriptu | DONE | Prvá obrazovka sa už neskrýva |
| Do `dist/` sa kopírovali nepoužité assety (1,08 MB) | DONE | `dist` 2 230 kB → 1 262 kB |
| Hero JPEG bez `srcset` | DONE | 760w varianta + `sizes`; hero má `fetchpriority="high"` |
| Fotografie neoptimalizované | DONE | Prekódované progresívne, 175 kB → 159 kB, mobil 51 kB |
| HTML a JS sa neminifikujú | NEEDS UPDATE | Minifikuje sa len CSS; gzip na Verceli väčšinu dorovná |
| Lokálne fonty, žiadny Google Fonts | DONE | 2 subsety, 68 kB, preload |
| Obrázky bez hashu v názve, cache 1 deň | NEEDS UPDATE | CSS/JS majú hash a `immutable` |

## 10. Obrázky a referencie

| Nález | Status | Poznámka |
|---|---|---|
| Alt texty netvrdia nič neoverené | DONE | Fotografie sú dekoratívne (`alt=""`), popis nesie okolitý text |
| Fotografie sú AI ilustračné | WAITING FOR CLIENT | Architektúra pripravená na výmenu za reálne fotografie |
| Nepoužité obrázky v `dist/` | DONE | Odstránené aj zo zdroja |
| Mená zákazníkov vo verejnom repozitári | DONE | Odstránené z `data/references.js`; ostávajú v histórii gitu — viď blokery |
| Štruktúra referencie pripravená na doplnenie | DONE | `clientName`, `serviceId`, `city`, `summary`, `logo`, `image`, `consent` |

## 11. Jazyk a texty

| Nález | Status |
|---|---|
| „keď na zariadenie ťažko zohnať náhradné diely" (chýbajúce sloveso) | DONE |
| „Koľko zariadení sa dopyt týka" → „Koľkých…" | DONE |
| „Pri druhom prípade" → „V druhom prípade" | DONE |
| Nesprávny pád: „v regióne Banská Bystrica a okolie do 80 km" | DONE |
| Pleonazmus „Nonstop, 24 hodín denne" | DONE (doplnené „7 dní v týždni") |
| Duplicitné poradové čísla sekcií na 4 stránkach | NEEDS UPDATE |
| „závada" (4×) vs „porucha" (57×) | NEEDS UPDATE |
| Nespárované úvodzovky na /modernizacia-vytahov/ | NEEDS UPDATE |
| Marketingové klišé („líder na trhu", „šité na mieru") | DONE — nevyskytujú sa |

## 12. Upratanie a tajomstvá

| Nález | Status | Poznámka |
|---|---|---|
| Žiadny commitnutý API kľúč ani token | DONE | Prehľadané sledované súbory aj história |
| `.gitignore` bez pravidla pre `.env` | DONE | Doplnené |
| Zdrojový master loga v `static/` (793 kB) | DONE | Presunutý do `brand/`, mimo publikovaného výstupu |
| Staré rekonštrukcie loga (`logo.svg`, `favicon.svg`, `og-default.svg`) | DONE | Zmazané |
| Mŕtve CSS triedy a nepoužité tokeny | NEEDS UPDATE | ~7 tried a ~47 legacy tokenov |
| `dist/_headers` je na Verceli mŕtva konfigurácia | NEEDS UPDATE | Slúži pre Netlify variantu |
| Lorem ipsum, TODO, debug výpisy v produkčnom UI | DONE | Nevyskytujú sa |

---

## Zhrnutie

- **BLOCKED:** 0. Produkčný build prechádza, identifikačné údaje sú doplnené.
- Ručný krok mimo kódu: zmazať legacy projekt `elevator-service-sk`
  (`prj_EHZFtnwy1stspQ98meUwRRL2GgFq`) — produkcia je overená, je to bezpečné.
- **NEEDS LEGAL REVIEW:** 0 — právny základ bol opravený; odporúčané je už len záverečné posúdenie znenia právnikom.
- **WAITING FOR CLIENT:** viď `CLIENT_DATA_TO_VERIFY.md`.
- **NEEDS UPDATE:** kozmetické a nepodstatné položky, žiadna z nich nebráni
  spusteniu; sú tu vedené preto, aby sa na ne nezabudlo.
