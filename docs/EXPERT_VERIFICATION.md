# NEEDS_EXPERT_VERIFICATION

Miesta, kde by na webe malo zaznieť **technické alebo právne tvrdenie**,
ale zatiaľ ho nemáme overené odborníkom klienta.

Pravidlo projektu: takéto tvrdenie sa **nikdy nedostane do produkčného UI
ako fakt**. Text je preto formulovaný tak, aby bol pravdivý aj bez neho —
hovorí o priebehu spolupráce, nie o legislatíve.

Tento súbor je pracovný podklad pre klienta a jeho odborne spôsobilú osobu.
Reťazec `NEEDS_EXPERT_VERIFICATION` sa nesmie objaviť vo výstupe —
build ho zachytí ako presakovanie a zlyhá.

---

## 1. Periodicita odborných prehliadok a skúšok

**Kde:** `src/pages/odborne-prehliadky-a-skusky.js`

**Ako je to teraz vyriešené:**
Stránka obsahuje blok *„Interval závisí od zariadenia"*, ktorý hovorí, že
periodicita nie je pre všetky výťahy rovnaká a konkrétny harmonogram
navrhneme po obhliadke. Žiadne číslo, žiadny odkaz na predpis.

**Čo treba overiť:**
- [ ] Aké lehoty sa reálne vzťahujú na typy zariadení, ktoré firma servisuje
- [ ] Či je vhodné uvádzať ich na webe, alebo radšej ponechať súčasnú formuláciu
- [ ] Presné názvoslovie úkonov, ktoré firma používa v dokumentácii

**Prečo to nie je vyplnené:** nesprávne uvedená lehota na webe servisnej
firmy je reputačné aj právne riziko a používatelia podľa nej plánujú termíny.

---

## 2. Rozdiel medzi odbornou prehliadkou a odbornou skúškou

**Kde:** `data/faq.js` → `faq.prehliadky[0]`

**Ako je to teraz vyriešené:**
Odpoveď hovorí, že ide o dva rôzne úkony s odlišným rozsahom a periodicitou,
pričom prehliadka overuje prevádzkový stav a skúška má širší rozsah.
Konkrétny rozsah oboch úkonov sa nešpecifikuje.

**Čo treba overiť:**
- [ ] Presné vymedzenie oboch úkonov v znení, ktoré firma používa
- [ ] Či sa formulácia dá spresniť bez rizika

---

## 3. Bezpečnostné pokyny pri uviaznutí vo výťahu

**Kde:** `src/pages/havarijna-sluzba.js` → `stepsTrapped`, `data/faq.js` → `faq.havaria[0]`

**Ako je to teraz vyriešené:**
Uvádzame všeobecne platné pokyny: zachovať pokoj, nepokúšať sa otvárať dvere,
nevystupovať z kabíny mimo stanice, použiť núdzové volanie, počkať na technika.
Súčasťou je aj tvrdenie, že *kabína je zaistená a nehrozí voľný pád*.

**Čo treba overiť:**
- [ ] Odsúhlasenie znenia odborne spôsobilou osobou klienta
- [ ] Formulácia o voľnom páde — či je vhodná pre všetky typy zariadení,
      ktoré firma servisuje
- [ ] Či firma chce doplniť vlastný postup nahlasovania

**Prečo je to citlivé:** ide o pokyny, podľa ktorých sa niekto zachová
v stresovej situácii. Musia sedieť.

---

## 4. Rozsah pravidelného servisu

**Kde:** `src/pages/servis-vytahov.js` → `includes`

**Ako je to teraz vyriešené:**
Zoznam úkonov (preventívne prehliadky, mazanie, nastavenie, kontrola
bezpečnostných prvkov, dverí, signalizácie, zápis, sledovanie termínov)
je uvedený so vetou, že *konkrétny rozsah sa dohodne pred podpisom zmluvy
a zodpovedá typu a veku zariadenia*.

**Čo treba overiť:**
- [ ] Či zoznam zodpovedá tomu, čo firma naozaj robí v rámci paušálu
- [ ] Čo v paušále nie je a malo by to byť na webe uvedené
- [ ] Či sa niektorý úkon nemá formulovať inak

---

## 5. Rozsah havarijnej služby

**Kde:** `src/pages/havarijna-sluzba.js` → sekcia „Čo havarijná služba rieši"

**Čo treba overiť:**
- [ ] Kto vykonáva vyslobodenie osôb — technik firmy alebo záchranné zložky
- [ ] Či firma zabezpečuje havarijnú službu vo vlastnej réžii
- [ ] Aký je reálny režim dostupnosti (súvisí s `emergency.enabled`)

---

## 6. Tvrdenia o prevzatí zariadenia od inej servisnej firmy

**Kde:** `data/faq.js` → `faq.servis[2]`, `data/content.js` → `processServis`

**Ako je to teraz vyriešené:**
Hovoríme, že zmena servisnej spoločnosti je bežná, rozhodujúca je výpovedná
lehota a odovzdanie dokumentácie, a že poradíme s postupom.

**Čo treba overiť:**
- [ ] Či firma pri prechode reálne asistuje a v akom rozsahu
- [ ] Či existujú prípady, kedy prevzatie nie je možné

---

## Postup pri overovaní

1. Klient / odborne spôsobilá osoba prejde body vyššie.
2. Overené znenie sa doplní do príslušného súboru v `data/` alebo `src/pages/`.
3. Bod sa v tomto dokumente odškrtne a doplní sa dátum a meno osoby, ktorá ho overila.
4. Spustí sa `npm run build:prod`.

| Bod | Overil | Dátum |
|---|---|---|
| 1. Periodicita | | |
| 2. Prehliadka vs. skúška | | |
| 3. Bezpečnostné pokyny | | |
| 4. Rozsah servisu | | |
| 5. Rozsah havarijnej služby | | |
| 6. Prevzatie od inej firmy | | |
