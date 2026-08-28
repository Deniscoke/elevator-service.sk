# Build report

Vygenerované: 2026-08-28 10:53
Režim: náhľadový
Doména: https://www.elevatorservis.sk
Servisná oblasť: Banská Bystrica a okolie do 80 km

> Tento súbor generuje `node build.mjs`. Needituj ho ručne.

## Vygenerované stránky

| Stránka | Súbor | Veľkosť | V sitemap |
| --- | --- | ---: | :---: |
| / | index.html | 45.5 kB | áno |
| /servis-vytahov/ | servis-vytahov/index.html | 37.4 kB | áno |
| /opravy-vytahov/ | opravy-vytahov/index.html | 35.7 kB | áno |
| /odborne-prehliadky-a-skusky/ | odborne-prehliadky-a-skusky/index.html | 35.8 kB | áno |
| /modernizacia-vytahov/ | modernizacia-vytahov/index.html | 36.1 kB | áno |
| /havarijna-sluzba/ | havarijna-sluzba/index.html | 31.3 kB | áno |
| /o-nas/ | o-nas/index.html | 27.6 kB | áno |
| /referencie/ | referencie/index.html | 21.7 kB | áno |
| /kariera/ | kariera/index.html | 19.1 kB | áno |
| /kontakt/ | kontakt/index.html | 26.2 kB | áno |
| /poradna/ | poradna/index.html | 27.7 kB | áno |
| /ochrana-osobnych-udajov/ | ochrana-osobnych-udajov/index.html | 17.7 kB | áno |
| /404.html | 404.html | 20.7 kB | nie |

CSS: 7 vrstiev → `css/main.css` (77.5 kB)
Sitemap: 12 URL

## Komponenty skryté pre chýbajúce dáta

| Komponent | Dôvod |
| --- | --- |
| `referenceSection` | data/references.js je prázdne (chýbajú realizácie a súhlasy) |

## Kontroly

- Presakovanie zástupných hodnôt: OK
- Interné odkazy: OK
- SEO metadáta: OK
- Pripravenosť na produkciu: 8 chýbajúcich údajov

### Chýba pred spustením webu

- [ ] Ulica a číslo (address.street)
- [ ] PSČ (address.postalCode)
- [ ] IČO (povinný údaj na webe) (legal.ico)
- [ ] Zápis v obchodnom registri (legal.registration)
- [ ] Napojenie formulára — data/forms.js → transport + endpoint
- [ ] Potvrdená doména — data/company.js → siteUrl alebo premenná SITE_URL
- [ ] Firemné logo — data/company.js → brand.logo
- [ ] OG obrázok vo formáte PNG/JPG 1200×630 — brand.ogImage

Detaily a kontext: [MISSING_DATA.md](./MISSING_DATA.md)
