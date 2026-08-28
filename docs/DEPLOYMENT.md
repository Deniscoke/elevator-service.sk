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

---

## Napojenie domény elevatorservis.sk

**Overený stav (28. 8. 2026):** doména je registrovaná a patrí klientovi.
Beží na Websupporte (`ns1–ns3.websupport.sk`, A záznam `37.9.175.12`),
má funkčnú poštu (MX `mailin1/2.elevatorservis.sk`) a na webe je len
parkovacia stránka Websupportu — **žiadny web tam nebeží**.

### Prečo ju Vercel „neponúka"

Vercel **nepredáva .sk domény**. To ale nie je prekážka: doménu netreba
od Vercelu kupovať. Stačí ju vo Verceli pridať ako *custom domain*
a nasmerovať na ňu DNS u súčasného registrátora.

### Postup (odporúčaný — DNS zostáva na Websupporte)

Nameservery sa **nemenia**, takže pošta beží ďalej bez zásahu.

1. Vercel → projekt → Settings → Domains → pridať `elevatorservis.sk`
   aj `www.elevatorservis.sk`.
2. V administrácii Websupportu upraviť DNS:

   | Typ | Názov | Hodnota |
   |---|---|---|
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

3. MX a ostatné záznamy **nechať bez zmeny** — inak prestane chodiť pošta.
4. Vercel vydá certifikát sám (Let's Encrypt), zvyčajne do pár minút.
5. Po nábehu doplniť `SITE_URL=https://www.elevatorservis.sk`
   do Environment Variables a prebuildovať, aby canonical a sitemap
   ukazovali na ostrú doménu.

### Čo nerobiť

**Neprepínať nameservery na Vercel.** Prevzal by celý DNS vrátane MX
a pošta na `elevator@elevatorservis.sk` by prestala fungovať, kým by sa
MX záznamy ručne nevytvorili znova. Pre tento projekt to nemá výhodu.

### Čo potrebuješ od klienta

Prístup do administrácie Websupportu — alebo mu poslať tie dva riadky
z tabuľky vyššie, sú to dve zmeny na päť minút.
