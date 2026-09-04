# Čo ešte potrebujeme od klienta

Stav k 4. 9. 2026. Sú tu **len skutočne otvorené položky**. Čo je potvrdené,
je už v `data/*.js` a na webe — a v tomto zozname to nemá čo robiť.

Pravidlo: pokiaľ položka nie je vyriešená, príslušný obsah sa **nevykresľuje**.
Web nikdy nič nedopĺňa odhadom.

---

## A. Bráni spusteniu

| Údaj | Prečo je potrebný | Kde sa doplní |
|---|---|---|
| **IČO** | Povinný identifikačný údaj podnikateľa na webovom sídle | `data/company.js` → `legal.ico` |
| **Zápis v obchodnom registri** | Povinný údaj (oddiel, vložka, súd) | `legal.registration` |
| **Ulica a číslo + PSČ sídla** | Dopĺňa adresu na webe aj v štruktúrovaných dátach; odomkne úplnú `PostalAddress` | `address.street`, `address.postalCode` |

Produkčný build (`npm run build:prod`) kým tieto chýbajú **zlyhá**. Je to zámer.

## B. Rozhodnutie klienta, nie údaj

| Otázka | Dôsledok |
|---|---|
| **Súhlas jednotlivých zákazníkov so zverejnením referencie** | Bez neho zostáva `/referencie/` bez menovaných referencií. Meno sa do repozitára doplní až spolu so súhlasom — repozitár je verejný. |
| **Presný zoznam a rozsah odborných oprávnení firmy** (čísla osvedčení, rozsah) | Bez neho sa sekcia „Odborné oprávnenia" nevykresľuje. Počet oprávnení sa nezverejňuje. |
| **Rok založenia / dĺžka pôsobenia** | Bez neho web neuvádza žiadny údaj typu „X rokov na trhu". |
| **Preplácame alebo spolufinancujeme školenia a certifikácie uchádzačov?** | Bez potvrdenia sa to na `/kariera/` netvrdí. |
| **Konkrétne otvorené pozície vrátane základnej zložky mzdy** | Bez mzdy sa pozícia nesmie zverejniť ako inzerát (§ 62 ods. 2 zák. č. 5/2004 Z. z.). Kým to tak je, `/kariera/` je evergreen stránka bez JobPosting schémy. |
| **Reakčný čas na nahlásenú poruchu** — je to záväzok, alebo len bežná prax? | Bez potvrdenia web žiadny čas nesľubuje. |
| **Doba uchovávania — potvrdiť znenie** | Aktuálne znenie: „najviac 2 roky od poslednej komunikácie, ak nás iná zákonná povinnosť alebo prebiehajúca spolupráca nezaväzuje uchovať ich dlhšie." Je to interné pravidlo firmy, nie zákonná lehota. |

## C. Na právne posúdenie

| Vec | Popis |
|---|---|
| **Právny základ spracúvania pri dopytovom formulári** | Formulár vyžaduje zaškrtnúť súhlas a stránka uvádza súhlas ako prvý právny základ. Pri bežnom dopyte býva vhodnejší predzmluvný vzťah. Zámerne sme to nemenili sami — detail v [LEGAL_CONTENT_SOURCES.md](./LEGAL_CONTENT_SOURCES.md). Informačná povinnosť je aj tak splnená, takže to nebráni spusteniu. |

## D. Materiál na neskôr

| Vec | Stav |
|---|---|
| **Reálne fotografie firmy** | Súčasné fotografie sú AI ilustračné. Nie sú označené ako reálne realizácie a alt texty nič netvrdia. Architektúra je pripravená na výmenu 1 : 1. |
| **Logo vo vektore (SVG / AI / EPS)** | Máme kvalitný raster od klienta a z neho odvodené varianty. Vektor by pomohol pri tlači a pri veľmi veľkých zobrazeniach. |
| **Overenie v Google Search Console** | Vlastníctvo musí potvrdiť majiteľ domény. Do `data/company.js` → `integrations.searchConsoleVerification` sa vloží až reálna hodnota. |

---

## Čo je už POTVRDENÉ (a preto tu nie je otvorené)

Pre poriadok — tieto údaje sú overené a používajú sa:

- 300+ servisovaných výťahov
- havarijná služba nonstop, 24 hodín denne, 7 dní v týždni
- telefón a havarijná linka `+421 905 365 177`
- e-mail `elevator@elevatorservis.sk`
- sídlo Banská Bystrica, servisná oblasť do 80 km
- typy zariadení a najčastejšie značky
- doba uchovávania údajov 2 roky od poslednej komunikácie (interné pravidlo)
- oficiálne logo — zdroj pravdy je `brand/logo-master.png`
