# Nasadenie

Výstupom buildu je priečinok `dist/` — obyčajné statické súbory.
Nepotrebuje bežiaci Node server, databázu ani nič ďalšie.

---

## Pred prvým spustením webu

```bash
npm run build:prod
```

Tento príkaz **zámerne zlyhá**, kým nie sú doplnené kritické údaje
(telefón, e-mail, IČO, adresa, doména, napojenie formulára, logo).
Zoznam nájdeš v [MISSING_DATA.md](./MISSING_DATA.md) a v [BUILD_REPORT.md](./BUILD_REPORT.md).

Je to poistka: web sa nedá spustiť s nefunkčným formulárom
ani bez povinných firemných údajov.

---

## Doména

Kanonické URL, sitemap a OpenGraph potrebujú finálnu doménu.
Nastavuje sa buď v `data/company.js` (`siteUrl`), alebo premennou prostredia:

```bash
SITE_URL=https://www.elevatorservis.sk npm run build:prod
```

Premenná má prednosť — hodí sa pre náhľadové nasadenia.

---

## Vercel

Repozitár sa dá pripojiť priamo. V nastaveniach projektu:

| Nastavenie | Hodnota |
|---|---|
| Framework Preset | **Other** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | *(nechať prázdne — projekt nemá závislosti)* |

Konfigurácia je aj v `vercel.json` (pekné URL, hlavičky, cache).

Pre produkčné nasadenie odporúčam nastaviť v projekte premennú
`SITE_URL` a zmeniť Build Command na `npm run build:prod`,
aby nasadenie zlyhalo skôr, než sa web dostane k ľuďom v nekompletnom stave.

---

## Netlify

| Nastavenie | Hodnota |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |

Konfigurácia je v `netlify.toml`.

---

## Cloudflare Pages

| Nastavenie | Hodnota |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |

Súbor `dist/_headers` sa aplikuje automaticky.

---

## Klasický webhosting (FTP)

```bash
npm run build:prod
```

Obsah priečinka `dist/` nahraj do koreňa webu (`public_html`, `www`…).
Adresárová štruktúra s `index.html` funguje na Apache aj nginx bez konfigurácie.

Pre správnu 404 stránku pridaj na Apache do `.htaccess`:

```apache
ErrorDocument 404 /404.html
```

---

## Lokálny náhľad

```bash
npm run dev
```

Zbuilduje projekt a spustí náhľad na `http://localhost:4173`
s peknými URL a funkčnou 404 stránkou — teda tak, ako to bude v produkcii.

---

## Napojenie formulára

Momentálne nie je vybraný backend. Postup po rozhodnutí:

### A) Serverless funkcia (Vercel / Netlify / Cloudflare)

```js
// data/forms.js
transport: 'json',
endpoint: '/api/dopyt',
```

Funkcia prijme JSON s poľami z `inquiryFields` a odošle e-mail.
Na Verceli patrí do `api/dopyt.js` (mimo `dist/`).

### B) Formspree / Basin / Netlify Forms

```js
transport: 'formdata',
endpoint: 'https://formspree.io/f/XXXXXXX',
```

Tento transport vie posielať aj prílohy — zapni ich cez
`forms.attachments.enabled = true`.

### C) Núdzový režim bez backendu

```js
transport: 'mailto',
endpoint: 'info@elevatorservis.sk',
```

Otvorí e-mailového klienta s predvyplnenou správou.
Funguje, ale je to najhoršia varianta pre konverzie — používaj len dočasne.

---

## Po nasadení

- [ ] Overiť `https://doména/sitemap.xml` a `https://doména/robots.txt`
- [ ] Odoslať sitemap do Google Search Console
- [ ] Otestovať odoslanie formulára naostro
- [ ] Overiť JSON-LD cez Rich Results Test
- [ ] Skontrolovať náhľad odkazu na Facebooku a LinkedIne (potrebuje PNG OG obrázok)
- [ ] Prepojiť Google Business Profile
- [ ] Zmerať Core Web Vitals na reálnej doméne
