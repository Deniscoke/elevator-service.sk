# Zdroje právnych tvrdení na webe

Interný dokument. **Nie je to právne stanovisko** — je to evidencia toho, o čo sa
opiera každá veta na webe, ktorá sa dotýka legislatívy, a čo sme naopak zámerne
nenapísali.

Pravidlo projektu: legislatívu neimprovizujeme. Ak sa tvrdenie nedá oprieť
o platný predpis alebo o písomné potvrdenie klienta, na web nejde.

---

## 1. Vyhláška MPSVR SR č. 508/2009 Z. z.

Vyhláška, ktorou sa ustanovujú podrobnosti na zaistenie bezpečnosti a ochrany
zdravia pri práci s technickými zariadeniami tlakovými, zdvíhacími, elektrickými
a plynovými a ktorou sa ustanovujú technické zariadenia, ktoré sa považujú za
vyhradené technické zariadenia.

Výťahy sú vyhradené technické zariadenia zdvíhacie.

### § 16 — revízny technik

Revízny technik musí mať odborné vzdelanie a odbornú prax v rozsahu, ktorý
určuje **príloha č. 11**, a musí byť držiteľom **osvedčenia** pre príslušný
rozsah činnosti.

Príloha č. 11 pre revízneho technika uvádza požadovanú dĺžku odbornej praxe:

| Vzdelanie | Požadovaná odborná prax |
|---|---|
| ÚSO (úplné stredné odborné) | 5 rokov |
| VŠ (vysokoškolské) | 2 roky |

**Ako sa to smie a nesmie formulovať**

Nesmie sa napísať, že „na pozíciu revízneho technika stačí 5 rokov praxe".
Prax je len jedna z podmienok. Popri nej sa vyžaduje príslušné odborné
vzdelanie, osvedčenie pre konkrétny rozsah činnosti a splnenie ďalších
zákonných predpokladov vrátane zdravotnej spôsobilosti.

Znenie použité na webe (`src/pages/kariera.js`, evergreen blok):

> Požadovaná odborná spôsobilosť závisí od konkrétnej činnosti a rozsahu prác.
> Pri pozícii revízneho technika sa riadi platnými právnymi predpismi — rozsah
> vzdelania, praxe a osvedčení určuje vyhláška č. 508/2009 Z. z. a jej príloha
> č. 11. Pri prácach na elektrických technických zariadeniach môžu pribudnúť
> ďalšie požiadavky na elektrotechnickú spôsobilosť.

Konkrétne hodnoty 5 rokov / 2 roky sa na webe **neuvádzajú**. Ak ich klient
bude chcieť zverejniť, musia byť naviazané na § 16 a prílohu č. 11 a musí byť
zrejmé, že ide len o časť podmienok.

### § 18 — opravy, rekonštrukcie a montáž

Činnosti podľa § 18 (oprava, rekonštrukcia, montáž vyhradeného technického
zariadenia) majú **vlastné** požiadavky na odbornú spôsobilosť. Nesmie sa
tvrdiť, že sú totožné s požiadavkami na revízneho technika podľa § 16.

### Elektrotechnická spôsobilosť

Pri prácach na elektrických technických zariadeniach môžu podľa rozsahu práce
pribudnúť ďalšie požiadavky na elektrotechnickú spôsobilosť. Web to uvádza ako
možnosť závislú od konkrétnej role, nie ako plošné tvrdenie.

---

## 2. Zákon č. 5/2004 Z. z. o službách zamestnanosti, § 62 ods. 2

Pri zverejnení ponuky zamestnania sa uvádza suma základnej zložky mzdy.

**Dopad na projekt:** klient mzdy nedodal, preto sa žiadna pozícia nezverejňuje
ako pracovný inzerát. V kóde to stráži `canPublishAsJobAd` v `data/careers.js`
— pozície sa vypíšu až vtedy, keď má **každá** vyplnené `salaryFrom`.
Kým je hodnota `false`, stránka `/kariera/` ukazuje evergreen obsah bez tvrdenia
o počte voľných miest a **negeneruje JobPosting štruktúrované dáta**.

---

## 3. Nariadenie (EÚ) 2016/679 (GDPR)

GDPR **nestanovuje konkrétnu dobu uchovávania**. Uplatňuje sa zásada
minimalizácie uchovávania — údaje sa nemajú uchovávať dlhšie, než je potrebné
na účel, na ktorý sa spracúvajú.

**Dopad na projekt:** doba „najviac 2 roky od poslednej komunikácie" je
**interné pravidlo klienta**, nie zákonná lehota. Text na stránke ochrany
osobných údajov to musí takto pomenovať a robí to
(`data/company.js` → `legal.dataRetention`).

Informačná povinnosť podľa čl. 13 je pokrytá stránkou
`/ochrana-osobnych-udajov/`: prevádzkovateľ, účel, kategórie údajov,
sprostredkovatelia (Vercel, Resend), prenos mimo EÚ, doba uchovávania,
práva dotknutej osoby a kanál na ich uplatnenie.

### Právny základ — stav po oprave (4. 9. 2026)

Pôvodne formulár vyžadoval zaškrtnúť **súhlas** a stránka uvádzala súhlas ako
prvý právny základ. Pri bežnom zákazníckom dopyte je to nepresné: spracúvanie
je nevyhnutné na to, aby sme na dopyt vôbec mohli odpovedať.

Na pokyn klienta bolo upravené takto:

- políčko vo formulári znie „Oboznámil/a som sa s informáciami o spracúvaní
  osobných údajov" — je to **potvrdenie o oboznámení, nie súhlas**,
- stránka ochrany osobných údajov uvádza ako právny základ **vykonanie
  opatrení pred uzavretím zmluvy na žiadosť dotknutej osoby**,
- výslovne sa uvádza, že zaškrtnutie políčka samo osebe právny základ
  nevytvára,
- súhlas sa spomína len pre prípad iného účelu, spolu s doložkou
  o zákonnosti spracúvania pred jeho odvolaním.

Informačná povinnosť podľa čl. 13 zostáva pokrytá v plnom rozsahu.
Odporúčanie: nechať finálne znenie prejsť osobou s právnou kvalifikáciou —
je to bežná záverečná kontrola, nie prekážka spustenia.

---

## 4. Čo sme zámerne NENAPÍSALI

| Tvrdenie | Prečo nie je na webe |
|---|---|
| Konkrétne intervaly odborných prehliadok a skúšok | Závisia od typu a zaradenia zariadenia; bez posúdenia odborne spôsobilej osoby by šlo o improvizáciu. FAQ preto hovorí o priebehu spolupráce, nie o lehotách. |
| Zoznam a počet oprávnení firmy | Klient nedoložil čísla osvedčení ani ich rozsah. `certifications: []` → sekcia sa nevykreslí. |
| Reakčný čas na poruchu | Nie je zmluvne potvrdený. `emergency.responseTimeNote: null`. |
| Počet rokov na trhu | Nepotvrdený a nedá sa presne dopočítať. `stats.yearsInBusiness: null`. |
| Mzdy a preplácanie školení či certifikácií | Klient nepotvrdil. |
| Mená zákazníkov a referencie | Chýba súhlas dotknutých subjektov. |

---

## 5. Ako to udržiavať

Keď klient dodá podklad, doplní sa **do dátovej vrstvy** (`data/*.js`), nie do
HTML. Zároveň sa v tomto dokumente doplní, o čo sa nové tvrdenie opiera.
Bez záznamu v tomto súbore sa nové právne tvrdenie na web nedostáva.
