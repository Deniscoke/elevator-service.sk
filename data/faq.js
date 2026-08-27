/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — často kladené otázky
 *
 * DÔLEŽITÉ PRAVIDLO
 * Žiadna odpoveď tu NESMIE tvrdiť konkrétny zákonný interval prehliadok,
 * skúšok ani inú lehotu, kým to neoverí odborník klienta.
 * Miesta, kde taký údaj patrí, sú vedené v docs/EXPERT_VERIFICATION.md.
 *
 * Odpovede sú preto formulované tak, aby boli pravdivé aj bez týchto údajov:
 * hovoria o priebehu spolupráce, nie o legislatíve.
 */

export const faq = {
  servis: [
    {
      q: 'Čo pravidelný servis výťahu zahŕňa?',
      a: 'Preventívnu prehliadku zariadenia v dohodnutom intervale, kontrolu a nastavenie mechanických častí, mazanie, kontrolu funkčnosti bezpečnostných prvkov a signalizácie a zápis o vykonanom úkone do dokumentácie zariadenia. Presný rozsah závisí od typu a veku výťahu — dohodneme ho pred podpisom zmluvy.',
    },
    {
      q: 'Ako často má servisný technik prísť?',
      a: 'Interval závisí od typu zariadenia, jeho veku a intenzity prevádzky. Pri obhliadke prejdeme dokumentáciu vášho výťahu a navrhneme harmonogram, ktorý zodpovedá konkrétnemu zariadeniu a platným požiadavkám. Nedávame paušál, ktorý by mal sedieť na každý výťah.',
    },
    {
      q: 'Sme viazaní zmluvou s inou servisnou firmou. Dá sa to zmeniť?',
      a: 'Áno, zmena servisnej spoločnosti je bežná vec. Rozhodujúca je výpovedná lehota v existujúcej zmluve a odovzdanie dokumentácie zariadenia. Pri obhliadke vám povieme, čo bude treba pripraviť a v akom poradí.',
    },
    {
      q: 'Čo potrebujete vedieť, aby ste vedeli dať cenu?',
      a: 'Adresu objektu, počet výťahov, typ zariadenia a jeho približný vek — najlepšie podľa výrobného štítku. Pomôže aj informácia, či máte k dispozícii dokumentáciu zariadenia a poslednú správu z prehliadky.',
    },
  ],

  opravy: [
    {
      q: 'Výťah stojí. Je to oprava alebo havária?',
      a: 'Ak je v kabíne uviaznutý človek, ide o havarijnú situáciu — postup nájdete na stránke havarijnej služby. Ak výťah stojí a nikto v ňom nie je, riešime to ako opravu: zistíme príčinu, navrhneme rozsah prác a cenu.',
    },
    {
      q: 'Opravujete aj zariadenia, ktoré bežne neservisujete?',
      a: 'Závisí od typu a stavu zariadenia. Napíšte nám, o aký výťah ide a ako sa porucha prejavuje — ozveme sa s jasnou odpoveďou, či to vieme prevziať.',
    },
    {
      q: 'Ako prebieha oprava od dopytu po dokončenie?',
      a: 'Dopyt — obhliadka a diagnostika — cenová ponuka s rozsahom prác — odsúhlasenie — zabezpečenie dielov — realizácia — odovzdanie a zápis do dokumentácie. Pri opakovanej poruche vám povieme aj to, či sa oprava ešte oplatí, alebo je rozumnejšia modernizácia.',
    },
    {
      q: 'Rovnaká porucha sa stále vracia. Čo s tým?',
      a: 'Opakovaná porucha býva príznak, nie príčina. Pozrieme sa preto aj na súvisiace uzly — problém býva inde, než kde sa porucha prejavuje. Výsledkom je návrh, ktorý rieši príčinu, nie len prejav.',
    },
  ],

  prehliadky: [
    {
      q: 'Aký je rozdiel medzi odbornou prehliadkou a odbornou skúškou?',
      a: 'Sú to dva rôzne úkony s odlišným rozsahom a odlišnou periodicitou. Odborná prehliadka overuje prevádzkový stav zariadenia, odborná skúška má širší rozsah. Pri obhliadke vám povieme, ktorý úkon a kedy sa týka vášho konkrétneho zariadenia.',
    },
    {
      q: 'Kto zodpovedá za to, aby sa prehliadka vykonala?',
      a: 'Za prevádzku zariadenia zodpovedá jeho prevádzkovateľ — pri bytovom dome typicky spoločenstvo vlastníkov alebo správca. Servisná spoločnosť zabezpečuje samotný úkon a dokumentáciu. Sledovanie termínov vieme viesť za vás.',
    },
    {
      q: 'Čo sa deje, keď sa pri prehliadke nájde nedostatok?',
      a: 'Nedostatok sa zapíše do správy spolu s návrhom, ako ho odstrániť. Dostanete správu aj cenovú ponuku na odstránenie. Rozhodnutie o rozsahu a termíne je na vás — my povieme, čo je bezpečnostne naliehavé a čo znesie odklad.',
    },
    {
      q: 'Vediete evidenciu termínov za nás?',
      a: 'Pri zariadeniach v našom servise sledujeme termíny úkonov a ozveme sa vopred, aby ste termín nepremeškali. Nemusíte si to strážiť sami.',
    },
  ],

  modernizacia: [
    {
      q: 'Kedy sa oprava už neoplatí a treba modernizáciu?',
      a: 'Keď sa ročné náklady na opravy priblížia k časti ceny obnovy, keď sa poruchy opakujú a keď na zariadenie ťažko zohnať náhradné diely. Konkrétne čísla vieme povedať až po obhliadke a po pohľade na históriu opráv.',
    },
    {
      q: 'Musí sa meniť celý výťah naraz?',
      a: 'Nie. Modernizácia sa dá rozdeliť do etáp — napríklad najprv riadenie a pohon, neskôr dvere a kabína. Etapy má zmysel plánovať tak, aby na seba technicky nadväzovali a nerobili sa práce dvakrát.',
    },
    {
      q: 'Ako dlho bude výťah mimo prevádzky?',
      a: 'Závisí od rozsahu prác a dostupnosti komponentov. Termín aj dĺžku odstávky dostanete v ponuke ešte pred začiatkom prác, aby ste ju vedeli včas oznámiť obyvateľom alebo užívateľom budovy.',
    },
    {
      q: 'Dá sa modernizovať aj samotná kabína?',
      a: 'Áno. Rekonštrukcia kabíny — steny, podlaha, osvetlenie, zrkadlo, madlá, ovládací panel — sa dá riešiť aj samostatne, ak je technológia výťahu v poriadku.',
    },
  ],

  havaria: [
    {
      q: 'Uviazol som vo výťahu. Čo mám robiť?',
      a: 'Zachovajte pokoj a nepokúšajte sa otvárať dvere ani opustiť kabínu vlastnými silami. Stlačte a podržte tlačidlo núdzového volania v kabíne. Počkajte na príchod technika alebo záchranných zložiek. Kabína je zaistená a nehrozí voľný pád.',
    },
    {
      q: 'Kedy volať havarijnú službu a kedy stačí nahlásiť opravu?',
      a: 'Havarijná služba rieši situácie, ktoré neznesú odklad — uviaznutá osoba v kabíne, zjavné poškodenie zariadenia alebo stav, pri ktorom nie je bezpečné výťah používať. Ostatné poruchy sa riešia ako bežná oprava.',
    },
    {
      q: 'Výťah nefunguje, ale nikto v ňom nie je. Čo teraz?',
      a: 'Výťah nepoužívajte a označte ho ako mimo prevádzky. Poruchu nahláste — potrebujeme adresu objektu, ktorý výťah v poradí a čo sa deje (nereaguje, zastal medzi poschodiami, neotvárajú sa dvere, hlučí).',
    },
  ],
};

/** Otázky pre homepage — prierez naprieč službami. */
export const faqHome = [
  faq.servis[3],
  faq.servis[2],
  faq.modernizacia[0],
  faq.havaria[1],
];
