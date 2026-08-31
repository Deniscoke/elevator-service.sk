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
endpoint: company.contact.email,   // nevypisuj adresu ručne
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

**Všetky tri sú povinné a žiadna nemá fallback.** Ak niektorá chýba, funkcia
vráti `503` a do logu napíše, ktorá to je. Zámerne tam nie je žiadna náhradná
adresa — radšej čitateľná chyba než dopyt odoslaný z adresy, o ktorej klient
nevie.

| Premenná | Povinná | Hodnota |
|---|---|---|
| `RESEND_API_KEY` | **áno** | Kľúč z resend.com (`re_…`) |
| `INQUIRY_TO` | **áno** | Kam chodia dopyty — `elevator@elevatorservis.sk` |
| `INQUIRY_FROM` | **áno** | Odosielateľ. Musí byť na doméne overenej v Resende. Tvar `Meno <adresa@doména>` alebo holá adresa. **Konkrétnu hodnotu určuje klient, v kóde nie je.** |
| `SITE_URL` | odporúčaná | `https://elevatorservis.sk` |

Nastavujú sa vo Vercel → Settings → Environment Variables, pre prostredia
Production aj Preview. Po zmene je nutný nový deploy — funkcie si premenné
načítajú pri štarte inštancie.

### Nastavenie Resendu

1. Vytvoriť účet na resend.com (free tier: 3 000 e-mailov/mesiac, 100/deň).
2. **Domains → Add Domain → `elevatorservis.sk`.**
3. Resend zobrazí konkrétne DNS záznamy pre túto doménu — typicky DKIM
   (`TXT` na subdoméne `resend._domainkey`), SPF (`TXT`) a voliteľný
   MAIL FROM záznam. **Tieto hodnoty sa preberajú z dashboardu Resendu,
   nie z tejto dokumentácie ani z generických návodov.** Sú viazané na
   konkrétny účet a doménu, takže sem sa naslepo nezapisujú.
4. Záznamy doplniť u správcu DNS domény (DNS nie je vo Verceli).
5. Počkať na stav **Verified** v Resende.
6. Vygenerovať API kľúč (Sending access stačí) a vložiť ho do Vercelu.
7. Až potom nastaviť `INQUIRY_FROM` na adresu v overenej doméne.

**Bez overenej domény Resend odmietne odoslať e-mail** — funkcia vtedy vráti
`502` a formulár používateľovi povie, že sa dopyt nepodarilo odoslať. Nikdy
nepredstiera úspech.

#### Čo sa pri tom NESMIE zmeniť

- **MX záznamy** — firemná pošta musí zostať funkčná. Resend na odosielanie
  MX nepotrebuje.
- **Nameservery** — DNS je spravované mimo Vercelu a ostáva tak.
- Existujúce SPF: ak už doména jeden `TXT` so `v=spf1` má, **nepridáva sa
  druhý** — do existujúceho sa doplní `include` podľa pokynu Resendu.
  Dva SPF záznamy na jednej doméne SPF rozbijú.

### Adresy v odoslaných e-mailoch

| E-mail | From | To | Reply-To |
|---|---|---|---|
| Notifikácia firme | `INQUIRY_FROM` | `INQUIRY_TO` | e-mail zákazníka — odpovedá sa priamo z schránky |
| Potvrdenie zákazníkovi | `INQUIRY_FROM` | e-mail zákazníka | `INQUIRY_TO` |

Potvrdenie sa posiela len vtedy, keď zákazník e-mail uviedol (formulár
pripúšťa aj samotný telefón) a keď zadaná adresa **nie je naša vlastná** —
inak by si systém mohol odpovedať sám sebe.

Ak zlyhá potvrdenie zákazníkovi, dopyt je už doručený firme a odpoveď
zostáva `200`. Zlyhanie sa zapíše do logu. Opačne to nefunguje: keď zlyhá
notifikácia firme, používateľ dostane `502` a vidí chybu.

### Chybové stavy

| Stav | Kedy nastane | Čo vidí používateľ |
|---|---|---|
| `200 ok` | dopyt doručený, alebo zachytený honeypot | potvrdenie |
| `400 validation_failed` | serverová validácia neprešla | výzva skontrolovať polia |
| `400 too_many_files` / `attachment_too_large` / `attachments_too_large` / `attachment_type` / `invalid_attachment` | príloha neprešla serverovou kontrolou | konkrétna hláška podľa dôvodu |
| `429 rate_limited` | viac než 5 odoslaní za minútu z jednej IP | výzva skúsiť o minútu |
| `502 send_failed` | Resend odmietol alebo nie je dostupný | chyba + odkaz na telefón |
| `503 not_configured` | chýba premenná prostredia | informácia, že odosielanie je nedostupné |
| `405` | iná metóda než POST | — |

Honeypot vracia `200` **pred** kontrolou konfigurácie — robot sa tak nedozvie
nič o stave servera.

### Prílohy

Povolené sú JPG, PNG, WebP a PDF; najviac 3 súbory, 2 MB na súbor, 3 MB spolu.

Server prílohy kontroluje **znova a nezávisle od prehliadača**. Neverí ani
prípone názvu, ani hlavičke `type`, ktorú pošle prehliadač — typ určí podľa
prvých bajtov súboru (magic bytes). Prípona uloženého súboru sa dosadí podľa
zisteného typu, takže `faktura.pdf.exe` s obsahom PDF skončí ako
`faktura.pdf`, a súbor `.exe` vydávaný za PNG sa odmietne. Názov prechádza
whitelistom znakov, takže cesty ani riadiace znaky neprejdú.

Veľkosť sa kontroluje z dĺžky base64 **pred dekódovaním** — veľký vstup tak
nič nealokuje.

### Rate limit — čo naozaj vie

`api/dopyt.js` počíta odoslania na IP v pamäti bežiacej inštancie:
5 za minútu. **Nie je to distribuovaný limit a nesmie sa tak prezentovať.**

Vercel spúšťa viac serverless inštancií naraz a po čase ich recykluje.
Dôsledky:

- požiadavky rozložené na N inštancií znamenajú až N × 5 pokusov za minútu,
- po studenom štarte je počítadlo prázdne,
- limit nie je bezpečnostná záruka, je to brzda proti primitívnemu zaplaveniu.

Skutočnú ochranu robia dve veci, ktoré od stavu inštancie nezávisia:
**honeypot** (skryté pole, ktoré vyplní len robot) a **minimálny čas
vyplnenia** formulára. Obe sú aktívne a testované.

Ak by spam prerástol, riešením je perzistentné počítadlo (Vercel KV, Redis)
alebo Vercel BotID. **Oboje je platená služba a zmena rozsahu — nezavádza sa
bez odsúhlasenia klientom.**

### Test pred spustením

Automatický test bez siete (Resend je podvrhnutý, nič sa neodosiela):

```bash
node api/dopyt.test.mjs
```

Pokrýva 27 scenárov: chýbajúce premenné po jednej, honeypot, validáciu,
adresy a Reply-To v oboch e-mailoch, ochranu proti slučke, prílohy vrátane
podvrhnutého typu a prekročených limitov, zlyhanie Resendu a rate limit.
Manuálny zoznam pre ostrú prevádzku je v `docs/PACKAGE_800_SCOPE.md`.

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
