# Údaje na potvrdenie klientom

Zoznam všetkých údajov na webe, ktoré pôsobia ako **faktické alebo obchodné
tvrdenie**. Každý z nich je centrálne konfigurovateľný — dá sa upraviť alebo
nastavením na `null` úplne vypnúť bez zásahu do šablón.

**Pravidlo projektu:** `null` = údaj nemáme → komponent sa nevykreslí.
Web nikde nedopĺňa odhad ani zástupnú hodnotu.

Zdroj potvrdených údajov: dotazník *„Doplňujúce otázky k novému webu"*
(28. 8. 2026).

---

## A. Potvrdené klientom, ale vhodné znovu overiť pred spustením

Tieto údaje klient uviedol písomne. Web ich zobrazuje ako fakt, preto by ich
mal pred spustením ešte raz potvrdiť — od vyplnenia dotazníka sa mohli zmeniť.

| Údaj | Hodnota na webe | Kde sa zobrazuje | Kde sa mení | Riziko |
|---|---|---|---|---|
| Roky na trhu | **26** | Trust bar na homepage a O nás | `data/company.js` → `stats.yearsInBusiness` | Obchodné tvrdenie |
| Počet servisovaných výťahov | **300+** | Trust bar | `stats.servicedLifts` | Obchodné tvrdenie |
| Havarijná dostupnosť | **Nonstop, 24 hodín denne** | Trust bar, hlavička, havarijná sekcia, sticky lišta | `emergency.enabled` + `emergency.hoursLabel` | **Vysoké** — záväzok dostupnosti |
| Reakčný čas | **do 1 hodiny** | O nás → „Prečo my" | `company.differentiators[0]` | **Vysoké** — merateľný záväzok |
| Odborné oprávnenia | **§ 16, § 18, § 22, § 23 vyhl. 508/2009 Z. z.** | Trust bar (počet 4), O nás | `company.certifications` | **Vysoké** — právne tvrdenie |
| Typy zariadení | Osobné, nákladné, malé nákladné | O nás → S čím pracujeme | `company.equipmentTypes` | Nízke |
| Značky výťahov | TRANSPORTA, GLOBAL LIFT, TREVA, LIFTCOMPONENTS | O nás | `company.brands` | Stredné — naznačuje rozsah |
| Servisná oblasť | Banská Bystrica a okolie **do 80 km** | Celý web | `data/locations.js` → `serviceArea` | Stredné |
| Telefón a havarijná linka | +421 905 365 177 | Celý web | `company.contact` | Vysoké — musí fungovať |
| E-mail | elevator@elevatorservis.sk | Pätička, kontakt, GDPR | `company.contact.email` | Vysoké |
| Pracovné pozície | 3 (servisný technik, revízny technik, elektrikár) | Kariéra | `data/careers.js` → `positions` | Stredné |
| Benefity | Auto, školenia, zaučenie, stabilita | Kariéra | `data/careers.js` → `benefits` | Nízke |

> **Ako ktorýkoľvek z nich vypnúť:** nastav hodnotu na `null` (alebo `[]` pri
> zoznamoch) a spusti `npm run build`. Príslušná dlaždica alebo sekcia zmizne
> a v `docs/BUILD_REPORT.md` pribudne dôvod.

---

## B. Chýbajú a blokujú spustenie

Produkčný build (`npm run build:prod`) **zlyhá**, kým nie sú doplnené.

| Údaj | Kde sa doplní | Prečo blokuje |
|---|---|---|
| **Ulica a číslo** | `company.address.street` | Povinný údaj; odomkne aj `LocalBusiness` schému pre Google |
| **PSČ** | `company.address.postalCode` | To isté |
| **IČO** | `company.legal.ico` | Povinný identifikačný údaj na webe firmy |
| **Zápis v obchodnom registri** | `company.legal.registration` | Povinný údaj |
| **Logo v elektronickej podobe** | `company.brand.logo` | Značka v hlavičke je rekonštrukcia z fotky pečiatky |

---

## C. Nepotvrdené — momentálne sa nezobrazujú

Tieto veci sú v architektúre pripravené, ale sekcia sa nevykreslí.
**Nič sa nevymýšľa.**

| Údaj | Stav | Čo sa odomkne po doplnení |
|---|---|---|
| **Referencie** (SBD Banská Bystrica, REALBYT V. K., FILBYT Fiľakovo) | `consent: false` — klient uviedol *„pri každej referencii sa treba najskôr dohodnúť"* | Sekcia referencií na homepage aj `/referencie/` |
| Fotografie firmy a prác | Klient uviedol *„pravdepodobne áno"* | Nahradia AI ilustračné zábery |
| Počet technikov | Nebolo v dotazníku | Dlaždica v trust bare |
| Rok založenia | Nebolo v dotazníku | — |
| Pracovné hodiny kancelárie | Nebolo v dotazníku | `openingHours` v `LocalBusiness` schéme |
| Mzdové rozpätie pozícií | Nebolo v dotazníku | Mzda pri pozíciách |
| DIČ / IČ DPH | Nebolo v dotazníku | Pätička, GDPR |
| Google Maps odkaz a GPS | Nebolo v dotazníku | `geo` v schéme |
| Doba uchovávania údajov z formulára | Nebolo v dotazníku | Sekcia v GDPR |
| Google firemný profil | Klient uviedol, že prístup **nemá** | `sameAs` v schéme |

---

## D. Fotografie — dôležité upozornenie

V `static/assets/foto/` sú **štyri AI generované ilustračné fotografie**
(strojovňa, rozvádzač, ruky technika, kabína).

- **Nezobrazujú túto firmu, jej zamestnancov ani jej realizácie.**
- Nikde na webe sa netvrdí, že áno — `alt` texty popisujú výjav všeobecne
  a pri fotografiách nie je žiadna zmienka o konkrétnej realizácii.
- Odporúčam ich pred spustením nahradiť reálnymi zábermi. Stačia fotky
  z mobilu; rozmery a orezy sú v kóde nastavené, takže výmena je len
  o nahradení súborov rovnakých názvov.

> Ak sa fotografia vymení, treba **znovu premerať kontrast textu** v hero
> a v akvizičnej sekcii — text leží priamo na fotke a jeho čitateľnosť
> závisí od svetlých miest v obrázku. Postup je popísaný v komentári
> v `src/styles/04-components.css`.

---

## E. Technické tvrdenia na odborné posúdenie

Vedené samostatne v [EXPERT_VERIFICATION.md](./EXPERT_VERIFICATION.md).
Web sa zámerne vyhýba uvedeniu konkrétnych zákonných lehôt a periodicity
odborných prehliadok a skúšok — hovorí o priebehu spolupráce, nie
o legislatíve.

---

## Kontrola v builde

Build obsahuje automatickú poistku proti presakovaniu nepotvrdených údajov
(`build.mjs` → `LEAK_PATTERNS` a `conditionalLeakPatterns`).

Kontrola je **dátovo závislá**: tvrdenie „24/7" alebo počet výťahov je chybou
len vtedy, keď zaň v `data/` nestojí potvrdený údaj. Ak sa `emergency.enabled`
prepne späť na `false`, build začne text „24/7" hlásiť ako chybu.
