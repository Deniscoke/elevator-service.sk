/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — kariéra
 *
 * positions[] je ZÁMERNE PRÁZDNE.
 * Nevymýšľame pracovné pozície, mzdy ani benefity.
 * Kariérna stránka zobrazí neutrálny stav "aktuálne nemáme zverejnenú pozíciu".
 */

/**
 * Tvar jednej pozície (pre budúce doplnenie):
 * {
 *   id: 'servisny-technik',
 *   slug: 'servisny-technik-vytahov',
 *   title: 'Servisný technik výťahov',
 *   location: 'Banská Bystrica',
 *   employmentType: 'FULL_TIME',      // schema.org
 *   salaryFrom: null, salaryTo: null, salaryPeriod: 'MONTH', currency: 'EUR',
 *   summary: '...',
 *   responsibilities: [...],
 *   requirements: [...],
 *   niceToHave: [...],
 *   offer: [...],
 *   datePosted: '2026-01-01',
 *   validThrough: null,
 * }
 */
export const positions = [];

/** ČAKÁ NA KLIENTA — zoznam benefitov. Nevypĺňať bez potvrdenia. */
export const benefits = [];

/**
 * Prijíma firma otvorené žiadosti aj bez zverejnenej pozície?
 * null = nevieme → CTA na zaslanie životopisu sa NEZOBRAZÍ.
 */
export const acceptsOpenApplications = null;

/** Čo bude na stránke, keď pozíciu otvoríme — pomáha uchádzačovi aj SEO. */
export const whatWePublish = [
  'Názov pozície a miesto výkonu práce',
  'Náplň práce a typ zariadení, s ktorými sa pracuje',
  'Požadovaná odbornosť a oprávnenia',
  'Forma spolupráce a rozsah úväzku',
  'Mzdové podmienky',
];
