# Chýbajúce údaje od klienta

Aktualizované po dodaní dotazníka „Doplňujúce otázky k novému webu" (28. 8. 2026).

**Z pôvodných 17 otvorených položiek zostáva 8.** Kým sú tu odškrtnuté ako
chýbajúce, príslušné komponenty sa na webe nezobrazujú.

Produkčný build (`npm run build:prod`) zlyhá, kým nie sú doplnené položky 🔴.
Aktuálny stav generuje build → [BUILD_REPORT.md](./BUILD_REPORT.md).

---

## ✅ Doplnené z dotazníka

| Údaj | Hodnota | Čo sa tým odomklo |
|---|---|---|
| Hlavný telefón | +421 905 365 177 | Telefón v hlavičke, pätičke, sticky lište |
| Havarijná linka | +421 905 365 177 | Havarijné tlačidlo, rýchle volanie z mobilu |
| Režim havarijnej služby | Nonstop, 24 h denne | Havarijná sekcia s reálnym číslom |
| Hlavný e-mail | elevator@elevatorservis.sk | Kontakt, GDPR sekcia „uplatnenie práv" |
| Roky na trhu | 26 | Trust layer |
| Počet výťahov | 300+ | Trust layer |
| Servisná oblasť | BB + 80 km, potvrdené | „Banská Bystrica a okolie do 80 km" na celom webe |
| Typy zariadení | Osobné, nákladné, malé nákladné | Sekcia „S čím pracujeme" |
| Značky | TRANSPORTA, GLOBAL LIFT, TREVA, LIFTCOMPONENTS | Sekcia „S čím pracujeme" |
| Oprávnenia | § 16, § 18, § 22, § 23 vyhl. 508/2009 Z. z. | Sekcia „Odborné oprávnenia", trust layer |
| Čas reakcie | Do 1 hodiny od nahlásenia | Sekcia „Prečo my" na stránke O nás |
| Pracovné pozície | Servisný technik, revízny technik, elektrikár | Kariérna stránka |
| Benefity | Auto, školenia, zaučenie, stabilita | Kariérna stránka |
| Prioritné mestá | BB, Zvolen, Brezno, Žiar, Detva, Tisovec, Hnúšťa | Pripravené lokalitné stránky |
| Segmenty | Bytové domy, správcovia, firmy, inštitúcie, developeri | Sekcia „Komu sú služby určené" |
| Farby značky | Žltá #FFC61A + grafit #12161B | Celá farebná paleta webu |

---

## 🔴 Blokuje spustenie webu

| | Údaj | Kam | Poznámka |
|---|---|---|---|
| 🔴 | **Ulica a číslo** | `company.js` → `address.street` | Odomkne aj `LocalBusiness` schému pre Google |
| 🔴 | **PSČ** | `address.postalCode` | — |
| 🔴 | **IČO** | `legal.ico` | Povinný údaj na webe firmy |
| 🔴 | **Zápis v obchodnom registri** | `legal.registration` | Povinný údaj |
| 🔴 | **Rozhodnutie o doméne** | `siteUrl` alebo `SITE_URL` | Klient uviedol „Neviem" — treba potvrdiť elevatorservis.sk |
| 🔴 | **Backend formulára** | `forms.js` → `transport` + `endpoint` | Bez toho sa dopyt neodošle |
| 🔴 | **Odsúhlasenie loga** | `brand.logo` | Klient má iba PNG/JPG. Značku sme prekreslili do vektoru — treba potvrdiť tvar |
| 🔴 | **OG obrázok 1200×630 PNG/JPG** | `brand.ogImage` | Zatiaľ SVG, ktoré sociálne siete v náhľade nevykreslia |

---

## ⚪ Nepovinné, ale zlepší web

| | Údaj | Kam | Stav podľa dotazníka |
|---|---|---|---|
| ⚪ | **Súhlasy s referenciami** | `references.js` → `consent: true` | „Pri každej referencii sa treba najskôr dohodnúť" — pripravené sú SBD BB, REALBYT V. K., FILBYT Fiľakovo |
| ⚪ | **Reálne fotografie firmy a prác** | `static/assets/foto/` | „Pravdepodobne áno". ⚠️ Web momentálne používa **AI generované ilustračné fotografie** — nie sú to zábery tejto firmy. Treba ich nahradiť reálnymi, viď poznámku nižšie |
| ⚪ | Počet technikov | `stats.technicians` | Nebolo v dotazníku |
| ⚪ | Rok založenia | `stats.foundedYear` | Nebolo v dotazníku |
| ⚪ | Pracovné hodiny kancelárie | `openingHours` | Havarijná linka je nonstop, kancelária neuvedená |
| ⚪ | Mzdové rozpätie pozícií | `careers.js` → `salaryFrom/To` | Nebolo v dotazníku |
| ⚪ | Odkaz na Google Maps a GPS | `address.mapUrl`, `coordinates` | — |
| ⚪ | Google firemný profil | `profiles.googleBusiness` | Klient uviedol, že prístup **nemá** — treba založiť alebo prevziať |
| ⚪ | DIČ / IČ DPH | `legal.dic`, `legal.icDph` | — |
| ⚪ | Doba uchovávania údajov z formulára | `ochrana-osobnych-udajov.js` | Sekcia sa nevykreslí, kým nie je odpoveď |
| ⚪ | Príjemcovia osobných údajov | tamtiež | — |

---

## ⚠️ Ilustračné fotografie

V `static/assets/foto/` sú štyri **AI generované** fotografie (strojovňa,
rozvádzač, ruky technika, kabína). Slúžia ako ilustrácia, aby web nebol
prázdny — nezobrazujú túto firmu, jej zamestnancov ani jej realizácie
a nikde sa netvrdí, že áno.

Pred spustením webu ich odporúčam nahradiť reálnymi zábermi. Stačia
fotky z mobilu: strojovňa, rozvádzač, technik pri práci, hotová kabína.
Rozmery a orezy sú v kóde nastavené, takže výmena je len o nahradení
súborov rovnakých názvov.

---

## Poznámky z dotazníka

- **Inšpirácia klienta:** lacoliftservis.sk. Neberieme ako predlohu — slúži
  len ako indícia, aký typ webu klient pozná.
- **„Čomu sa vyhnúť":** klient odpovedal „neviem". Riadime sa vlastným
  pravidlom — žiadne marketingové frázy a žiadne nepodložené tvrdenia.
- **Cieľ webu podľa klienta:** *„získali sme nové výťahy do servisu."*
  Preto je akvizičná sekcia najvýraznejším blokom homepage.

---

## Ako údaj doplniť

1. Otvor príslušný súbor v `data/`.
2. Nahraď `null` skutočnou hodnotou (prázdne pole `[]` naplň záznamami).
3. Spusti `npm run build`.
4. Skontroluj `docs/BUILD_REPORT.md`.

Nikde inde v projekte netreba nič meniť.
