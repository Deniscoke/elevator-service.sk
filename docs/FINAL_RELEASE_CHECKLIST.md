# Finálny release checklist

Postup pri spustení a pri každom ďalšom nasadení. Odškrtáva sa zhora nadol —
každý bod má príkaz alebo miesto, kde sa overí.

---

## 1. Pred nasadením — lokálne

```bash
npm run build         # náhľadový build, prejde aj s varovaniami
node qa.mjs           # statická kontrola HTML a metadát
node test/dopyt.test.mjs   # 38 scenárov dopytového formulára, bez siete
npm run build:prod    # ZLYHÁ, kým chýbajú kritické údaje klienta
```

| Kontrola | Očakávané |
|---|---|
| `npm run build` | „Hotovo" + zoznam varovaní o chýbajúcich údajoch |
| `node qa.mjs` | „Bez nálezov." |
| `node test/dopyt.test.mjs` | `38/38 prešlo.` |
| `npm run build:prod` | Prejde až po doplnení IČO, zápisu a adresy — dovtedy je zlyhanie správne |
| `git status` | Čistý strom, `dist/` nie je v gite |

## 2. Obsah — čo sa nesmie objaviť v produkcii

Rýchla kontrola nad vygenerovaným výstupom:

```bash
grep -riE "lorem|TODO|FIXME|John Doe|26 rokov|do 1 hodiny|obsadzujeme" dist/ | grep -v "\.map$"
```

Očakávaný výsledok: **žiadny výstup**.

Build má navyše vlastnú poistku (`checkLeaks` v `build.mjs`), ktorá je naviazaná
na dátovú vrstvu — keď je údaj v dátach `null`, príslušné tvrdenie v HTML build
zastaví.

## 3. Konfigurácia vo Verceli

| Položka | Hodnota |
|---|---|
| Projekt | `elevetorservis.sk`, `prj_unceb1AellmRGkV2Br1ldtCR9tkU` |
| Tím | `team_5DYuL7aZP9vwM0z1K7z3Ji9m` |
| Repozitár / vetva | `Deniscoke/elevator-service.sk`, `main` |
| Premenné (Production) | `RESEND_API_KEY`, `INQUIRY_TO`, `INQUIRY_FROM`, `SITE_URL` |

```bash
vercel env ls production      # vypíše názvy, nie hodnoty
cat .vercel/project.json      # musí sedieť projectId aj orgId
```

Po zmene premennej je nutný **nový deploy** — funkcie si ich čítajú pri štarte.

## 4. Doména a HTTPS

```bash
curl -sI https://elevatorservis.sk/ | head -1          # 200
curl -sI https://www.elevatorservis.sk/ | head -2      # 308 na apex
curl -sI http://elevatorservis.sk/ | head -2           # 308 na https
```

DNS je mimo Vercelu. **MX ani nameservery sa nemenia.** Presmerovanie
`www` → apex je nastavené na úrovni domény v projekte.

## 5. Živý web po nasadení

| Kontrola | Príkaz / miesto |
|---|---|
| Domovská stránka | `curl -so /dev/null -w '%{http_code}' https://elevatorservis.sk/` |
| Stránky služieb | `/servis-vytahov`, `/opravy-vytahov`, `/odborne-prehliadky-a-skusky`, `/modernizacia-vytahov` |
| Havarijná služba, kontakt, kariéra | `/havarijna-sluzba`, `/kontakt`, `/kariera` |
| Sitemap a robots | `/sitemap.xml`, `/robots.txt` |
| Formulár | `POST /api/dopyt` — pri správnej konfigurácii nesmie vrátiť `503` |
| Konzola prehliadača | Žiadna chyba na domovskej stránke ani na `/kontakt` |

## 6. Formulár — kontrolovaný ostrý test

Automatické testy nič neodosielajú. Ostrý test **doručí e-mail do schránky
klienta**, preto sa robí raz a po dohode:

1. Odoslať jeden dopyt z `/kontakt/` s poznámkou, že ide o test.
2. Overiť, že prišiel do `elevator@elevatorservis.sk` do minúty.
3. Odpovedať naň v e-mailovom kliente — adresátom musí byť odosielateľ dopytu.
4. Overiť potvrdzovací e-mail u odosielateľa (predmet
   „Ďakujeme za váš dopyt – ELEVÁTOR SERVIS") a že nie je v spame.

Opakované testovacie dopyty sa neposielajú.

## 7. Po spustení — manuálne kroky

1. Google Search Console → pridať a overiť doménu `elevatorservis.sk`.
   Overovaciu hodnotu vložiť do `data/company.js` →
   `integrations.searchConsoleVerification` a nasadiť. **Žiadne fake ID.**
2. Odoslať `https://elevatorservis.sk/sitemap.xml`.
3. Skontrolovať domovskú stránku nástrojom na kontrolu URL, požiadať o indexáciu.
4. To isté pre štyri stránky služieb a `/kontakt/`.
5. O týždeň skontrolovať stav indexácie a kanonických URL.
6. Rozhodnúť o osude duplicitného projektu `elevator-service-sk`
   (`prj_EHZFtnwy1stspQ98meUwRRL2GgFq`) — kým existuje, je na
   `elevator-service-sk.vercel.app` verejná indexovateľná kópia webu.

## 8. Kedy sa NESMIE nasadzovať

- `npm run build:prod` zlyháva z iného dôvodu než pre chýbajúce údaje klienta.
- `node test/dopyt.test.mjs` neprejde celý.
- Do repozitára by sa dostalo tajomstvo (`.env`, API kľúč) — `.gitignore` to
  kryje, ale pri podozrení platí: **kľúč sa rotuje**, nikam sa nekopíruje.
- Na web by sa dostal údaj, ktorý klient nepotvrdil.
