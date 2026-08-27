# Chýbajúce údaje od klienta

Zoznam údajov, ktoré web potrebuje, ale zatiaľ ich nemáme.
Kým sú tu odškrtnuté ako chýbajúce, príslušné komponenty sa **nezobrazujú** —
web nikde nepoužíva vymyslenú ani orientačnú hodnotu.

**Produkčný build (`npm run build:prod`) zlyhá**, kým nie sú doplnené položky
označené ako 🔴 **blokujúce**.

Aktuálny stav generuje build → [BUILD_REPORT.md](./BUILD_REPORT.md).

---

## 1. Kontakt

| | Údaj | Kam sa doplní | Čo sa tým odomkne |
|---|---|---|---|
| 🔴 | **Hlavný telefón** | `data/company.js` → `contact.phone` | Telefón v hlavičke, pätičke, sticky lište a na kontakte |
| ⚪ | Prevádzkové hodiny telefónu | `contact.phoneNote` | Popisok pri čísle („Po–Pi 7:00–15:30") |
| 🔴 | **Hlavný e-mail** | `contact.email` | E-mail v pätičke a na kontakte, GDPR sekcia „uplatnenie práv" |
| ⚪ | E-mail pre kariéru | `contact.emailCareers` | Samostatný kontakt na kariérnej stránke |

## 2. Havarijná služba

| | Údaj | Kam sa doplní | Čo sa tým odomkne |
|---|---|---|---|
| ⚪ | **Havarijné telefónne číslo** | `contact.emergencyPhone` | Havarijné tlačidlo v hlavičke, sticky lište, na homepage a na stránke havárie |
| ⚪ | **Potvrdenie režimu služby** | `emergency.enabled` + `emergency.mode` | Bez potvrdenia sa nezobrazí žiadny havarijný telefón |
| ⚪ | Popis dostupnosti | `emergency.hoursLabel` | Text pri havarijnom čísle |
| ⚪ | Priemerný čas výjazdu | `emergency.responseTimeNote` | Údaj v trust layeri |

> ⚠️ **Dôležité:** kým `emergency.enabled` nie je `true`, web nikde netvrdí
> nonstop dostupnosť ani neuvádza havarijné číslo. Formulácia „24/7" je
> v build kontrole zakázaná — build ju zachytí ako presakovanie zástupnej hodnoty.

## 3. Adresa a právne údaje

| | Údaj | Kam sa doplní |
|---|---|---|
| 🔴 | **Ulica a číslo** | `address.street` |
| 🔴 | **PSČ** | `address.postalCode` |
| ⚪ | Odkaz na Google Maps | `address.mapUrl` |
| ⚪ | GPS súradnice | `address.coordinates` |
| ⚪ | Pracovné hodiny | `openingHours` |
| 🔴 | **IČO** | `legal.ico` |
| ⚪ | DIČ | `legal.dic` |
| ⚪ | IČ DPH | `legal.icDph` |
| 🔴 | **Zápis v obchodnom registri** | `legal.registration` |

> Adresa odomyká aj `LocalBusiness` schému. Bez nej sa **zámerne negeneruje** —
> prázdna deklarácia by SEO nepomohla a bola by nepravdivá.

## 4. Servisná oblasť

| | Údaj | Kam sa doplní |
|---|---|---|
| ⚪ | **Potvrdenie polomeru pôsobnosti** | `data/locations.js` → `serviceArea.confirmed` + `radiusKm` |

Zatiaľ sa všade používa formulácia **„Banská Bystrica a okolie"**.
Po potvrdení sa automaticky zmení na „Banská Bystrica a okolie do 80 km"
(alebo iný potvrdený polomer) — na všetkých stránkach naraz.

## 5. Čísla do trust layeru

| | Údaj | Kam sa doplní |
|---|---|---|
| ⚪ | Počet rokov na trhu / rok založenia | `stats.yearsInBusiness`, `stats.foundedYear` |
| ⚪ | Počet servisovaných výťahov | `stats.servicedLifts` |
| ⚪ | Počet servisných technikov | `stats.technicians` |

> Trust layer sa zobrazí, až keď budú aspoň **dva** overené údaje.
> Jedna osamotená dlaždica pôsobí horšie než žiadna.

## 6. Odbornosť a zariadenia

| | Údaj | Kam sa doplní |
|---|---|---|
| ⚪ | Odborné oprávnenia / certifikácie | `company.certifications` |
| ⚪ | Typy zariadení (lanové, hydraulické…) | `company.equipmentTypes` |
| ⚪ | Podporované značky výťahov | `company.brands` |

Odomkne sekcie „Odborné oprávnenia" a „S čím pracujeme" na stránke *O nás*.

## 7. Referencie a fotografie

| | Údaj | Kam sa doplní |
|---|---|---|
| ⚪ | Realizácie (min. 3–6) | `data/references.js` → `references[]` |
| ⚪ | **Súhlas zákazníkov so zverejnením** | pole `consent: true` pri každej referencii |
| ⚪ | Fotografie realizácií | `assets/referencie/` + pole `image` |
| ⚪ | Hodnotenia zákazníkov | `testimonials[]` |

Ku každej referencii potrebujeme: typ objektu, mesto, rok, čo sa robilo
a či môžeme uviesť meno zákazníka.

## 8. Vizuálna identita

| | Údaj | Kam sa doplní |
|---|---|---|
| 🔴 | **Firemné logo (SVG)** | `brand.logo` + `assets/` |
| ⚪ | Svetlá verzia loga | `brand.logoInverse` |
| ⚪ | Firemné farby | `brand.colors` → prepis v `src/styles/01-tokens.css` |
| 🔴 | **OG obrázok 1200×630 (PNG/JPG)** | `brand.ogImage` |

> Zatiaľ sa používa typografická značka a dočasný SVG OG obrázok.
> SVG väčšina sociálnych sietí v náhľadoch odkazov nevykresľuje — treba raster.

## 9. Kariéra

| | Údaj | Kam sa doplní |
|---|---|---|
| ⚪ | Pracovné pozície | `data/careers.js` → `positions[]` |
| ⚪ | Mzdové podmienky | pole `salaryFrom` / `salaryTo` |
| ⚪ | Zamestnanecké benefity | `benefits[]` |
| ⚪ | Prijímate otvorené žiadosti? | `acceptsOpenApplications` |

Kým je `positions` prázdne, kariérna stránka zobrazuje pravdivý stav
„nemáme zverejnenú pozíciu" a nič si nevymýšľa.

## 10. Technické a prevádzkové

| | Údaj | Kam sa doplní |
|---|---|---|
| 🔴 | **Finálna doména** | `company.siteUrl` alebo premenná `SITE_URL` |
| 🔴 | **Backend formulára** | `data/forms.js` → `transport` + `endpoint` |
| ⚪ | Povolenie príloh vo formulári | `forms.attachments.enabled` |
| ⚪ | Google Business Profile | `profiles.googleBusiness` |
| ⚪ | Sociálne siete | `profiles.facebook`, `profiles.linkedin` |

## 11. GDPR

| | Údaj | Kde sa prejaví |
|---|---|---|
| 🔴 | **Identifikačné údaje prevádzkovateľa** | IČO, adresa, zápis v OR |
| ⚪ | Doba uchovávania údajov z formulára | doplniť sekciu do `src/pages/ochrana-osobnych-udajov.js` |
| ⚪ | Príjemcovia údajov (napr. poskytovateľ e-mailu, CRM) | doplniť sekciu |
| ⚪ | Zodpovedná osoba, ak je určená | `legal.dpo` |
| ⚪ | **Odsúhlasenie finálneho znenia klientom** | — |

> Sekcie o dobe uchovávania a príjemcoch sa zámerne **nevykresľujú**,
> kým nemáme reálnu odpoveď. Všeobecná fráza by bola právne bezcenná.

---

## Ako údaj doplniť

1. Otvor príslušný súbor v `data/`.
2. Nahraď `null` skutočnou hodnotou (prázdne pole `[]` naplň záznamami).
3. Spusti `npm run build`.
4. Skontroluj `docs/BUILD_REPORT.md` — ubudne riadok zo zoznamu skrytých komponentov.

Nikde inde v projekte netreba nič meniť. Šablóny čítajú výhradne z `data/`.
