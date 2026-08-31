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

## Produkčná doména elevatorservis.sk

**Kanonická doména je apex `https://elevatorservis.sk`.**
`www.elevatorservis.sk` na ňu trvalo presmeruje (301) — pravidlo je
vo `vercel.json` v sekcii `redirects`.

### Overený stav domény (31. 8. 2026)

| | |
|---|---|
| Registrácia | doména existuje a patrí klientovi |
| Nameservery | `ns1.websupport.sk`, `ns2.websupport.sk`, `ns3.websupport.sk` |
| Súčasný A záznam | `37.9.175.12` (parkovacia stránka Websupportu) |
| Pošta | funkčná — MX `mailin1.elevatorservis.sk`, `mailin2.elevatorservis.sk` |
| Web | **žiadny — len parkovacia stránka**, prepnutie nič nerozbije |

### Prečo Vercel doménu „neponúka"

Vercel **nepredáva .sk domény**, preto sa vo vyhľadávaní domén nezobrazí.
Kupovať ju tam netreba — doména sa len pridá k projektu ako *custom domain*
a nasmeruje sa naň DNS u súčasného registrátora.

### DNS záznamy

Obe domény sú už pridané do projektu `elevetorservis.sk`.
Hodnoty nižšie sú **presne tie, ktoré vypísal Vercel** po ich pridaní
(`vercel domains inspect`), nie všeobecné odporúčanie:

| Typ | Názov | Hodnota |
|---|---|---|
| A | `elevatorservis.sk` | `76.76.21.21` |
| A | `www.elevatorservis.sk` | `76.76.21.21` |

Nastavuje sa v administrácii **Websupportu**. Nič iné sa nemení.

### Čo sa NESMIE zmeniť

- **MX záznamy** — pošta `elevator@elevatorservis.sk` musí ďalej fungovať.
- **Nameservery.** Vercel ponúka aj možnosť prepnúť NS na `ns1/ns2.vercel-dns.com`.
  **Nerobiť.** Prevzal by celý DNS vrátane MX a pošta by prestala chodiť,
  kým by sa MX ručne nevytvorili znova. Pre tento projekt to nemá výhodu.

### Po nábehu DNS

1. Vercel vydá TLS certifikát sám (Let's Encrypt), zvyčajne do pár minút.
2. Doplniť premennú `SITE_URL=https://elevatorservis.sk` a prebuildovať,
   aby canonical, OpenGraph a sitemap ukazovali na ostrú doménu.
3. Overiť, že `www.elevatorservis.sk` presmeruje na apex.

---

## Dopytový formulár

Formulár posiela dáta na vlastnú serverless funkciu `api/dopyt.js`, ktorá ich
odošle e-mailom cez Resend. Projekt tým **zostáva bez npm závislostí** —
Resend sa volá cez `fetch` na REST API.

### Premenné prostredia vo Verceli

| Premenná | Povinná | Hodnota |
|---|---|---|
| `RESEND_API_KEY` | **áno** | Kľúč z resend.com |
| `INQUIRY_TO` | nie | Kam chodia dopyty. Bez nej sa použije `contact.email` z `data/company.js` |
| `INQUIRY_FROM` | nie | Odosielateľ. Musí byť na doméne overenej v Resende |
| `SITE_URL` | odporúčaná | `https://elevatorservis.sk` |

### Nastavenie Resendu

1. Vytvoriť účet na resend.com (free tier: 3 000 e-mailov/mesiac, 100/deň).
2. Pridať doménu `elevatorservis.sk` a doplniť **TXT záznamy** (DKIM + SPF),
   ktoré Resend zobrazí. **MX sa nemenia.**
3. Vygenerovať API kľúč a vložiť ho do Vercelu ako `RESEND_API_KEY`.

### Správanie bez kľúča

Funkcia vráti `503 not_configured` a formulár používateľovi povie, že
odosielanie je nedostupné a má sa ozvať telefonicky alebo e-mailom.
**Nikdy nepredstiera úspech a dopyt nikdy ticho nezahodí.**

### Antispam

Honeypot pole, minimálny čas vyplnenia, serverová validácia zrkadliaca
klientskú, limity dĺžky polí a jednoduchý rate limit (5 odoslaní za minútu
z jednej IP). Žiadna CAPTCHA, žiadne sledovanie.

---

## Search Console a analytika

Obe sú pripravené, ale **vypnuté** — kým nie sú v `data/company.js` reálne
hodnoty, do stránky sa nevloží nič. Žiadne fake ID.

```js
// data/company.js
integrations: {
  searchConsoleVerification: null,   // obsah meta tagu google-site-verification
  analytics: { provider: null, id: null, scriptUrl: null },
}
```

**Odporúčanie:** bezcookie analytika (Plausible alebo Umami). Nezbiera osobné
údaje, nevyžaduje súhlas ani cookie lištu a stačí doplniť `provider` a `id`.

GA4 ukladá cookies a bez súhlasu sa spúšťať nesmie. Consent vrstva nie je
súčasťou tohto balíka — ak klient trvá na GA4, treba ju doobjednať.
Stránka ochrany osobných údajov sa textu o cookies prispôsobí automaticky
podľa toho, či je analytika zapnutá.
