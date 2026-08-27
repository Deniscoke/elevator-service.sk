# Build report

Vygenerované: 2026-08-27 08:07
Režim: náhľadový
Doména: https://www.elevatorservis.sk
Servisná oblasť: Banská Bystrica a okolie (nepotvrdená)

> Tento súbor generuje `node build.mjs`. Needituj ho ručne.

## Vygenerované stránky

| Stránka | Súbor | Veľkosť | V sitemap |
| --- | --- | ---: | :---: |
| / | index.html | 41.2 kB | áno |
| /servis-vytahov/ | servis-vytahov/index.html | 35.5 kB | áno |
| /opravy-vytahov/ | opravy-vytahov/index.html | 33.8 kB | áno |
| /odborne-prehliadky-a-skusky/ | odborne-prehliadky-a-skusky/index.html | 33.9 kB | áno |
| /modernizacia-vytahov/ | modernizacia-vytahov/index.html | 34.2 kB | áno |
| /havarijna-sluzba/ | havarijna-sluzba/index.html | 29.1 kB | áno |
| /o-nas/ | o-nas/index.html | 21.0 kB | áno |
| /referencie/ | referencie/index.html | 19.8 kB | áno |
| /kariera/ | kariera/index.html | 15.2 kB | áno |
| /kontakt/ | kontakt/index.html | 24.1 kB | áno |
| /poradna/ | poradna/index.html | 25.8 kB | áno |
| /ochrana-osobnych-udajov/ | ochrana-osobnych-udajov/index.html | 16.1 kB | áno |
| /404.html | 404.html | 19.3 kB | nie |

CSS: 6 vrstiev → `css/main.css` (57.7 kB)
Sitemap: 12 URL

## Komponenty skryté pre chýbajúce dáta

| Komponent | Dôvod |
| --- | --- |
| `trustBar` | menej než 2 overené údaje (chýbajú roky, počet výťahov, technici, oprávnenia) |
| `referenceSection` | data/references.js je prázdne (chýbajú realizácie a súhlasy) |

## Kontroly

- Presakovanie zástupných hodnôt: OK
- Interné odkazy: OK
- SEO metadáta: OK
- Pripravenosť na produkciu: 10 chýbajúcich údajov

### Chýba pred spustením webu

- [ ] Hlavné telefónne číslo (contact.phone)
- [ ] Hlavný e-mail (contact.email)
- [ ] Ulica a číslo (address.street)
- [ ] PSČ (address.postalCode)
- [ ] IČO (povinný údaj na webe) (legal.ico)
- [ ] Zápis v obchodnom registri (legal.registration)
- [ ] Napojenie formulára — data/forms.js → transport + endpoint
- [ ] Potvrdená doména — data/company.js → siteUrl alebo premenná SITE_URL
- [ ] Firemné logo — data/company.js → brand.logo
- [ ] OG obrázok vo formáte PNG/JPG 1200×630 — brand.ogImage

Detaily a kontext: [MISSING_DATA.md](./MISSING_DATA.md)
