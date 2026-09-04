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

### Otvorená otázka — NEEDS LEGAL REVIEW

Formulár obsahuje **povinné** zaškrtávacie políčko so znením
„Súhlasím so spracúvaním osobných údajov na účel vybavenia tohto dopytu",
a stránka ochrany osobných údajov uvádza ako právny základ v prvom rade
**súhlas**.

Pri bežnom zákazníckom dopyte býva vhodnejším právnym základom
**predzmluvný vzťah** (čl. 6 ods. 1 písm. b), prípadne oprávnený záujem —
súhlas má byť slobodný, a súhlas vynútený ako podmienka odoslania formulára
je sporný.

Toto **zámerne nemeníme sami** — je to právny záver, nie technická oprava.
Odporúčaný postup: nech znenie políčka aj odsek o právnom základe posúdi
osoba s právnou kvalifikáciou. Technicky je zmena triviálna (jedno pole
v `src/lib/form.js` a jeden odsek v `src/pages/ochrana-osobnych-udajov.js`).

Informačná povinnosť je aj v súčasnom stave splnená, takže to nebráni
technickému spusteniu webu.

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
