/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — lokality a servisná oblasť
 *
 * Servisná oblasť je POTVRDENÁ klientom v dotazníku (28. 8. 2026):
 * „Banská Bystrica + približne 80 km" — áno.
 *
 * Lokalitné stránky sa napriek tomu negenerujú automaticky.
 * Vzniknú až vtedy, keď k nim bude reálny obsah — inak by šlo
 * o prázdne doorway stránky, ktoré SEO skôr uškodia.
 */

export const serviceArea = {
  centerCity: 'Banská Bystrica',
  radiusKm: 80,
  confirmed: true,
  provisionalLabel: 'Banská Bystrica a okolie',
  confirmedLabelTemplate: 'Banská Bystrica a okolie do {radius} km',
};

export const primaryLocation = {
  name: 'Banská Bystrica',
  slug: 'banska-bystrica',
  inflected: {
    locative: 'v Banskej Bystrici',
    genitive: 'Banskej Bystrice',
    accusative: 'Banskú Bystricu',
  },
};

/**
 * Mestá, ktoré chce klient prioritne komunikovať (podľa dotazníka).
 * published: false → stránka sa negeneruje a nie je v sitemap.
 */
export const plannedLocations = [
  { name: 'Zvolen',          slug: 'zvolen',          locative: 'vo Zvolene',         published: false },
  { name: 'Brezno',          slug: 'brezno',          locative: 'v Brezne',           published: false },
  { name: 'Žiar nad Hronom', slug: 'ziar-nad-hronom', locative: 'v Žiari nad Hronom', published: false },
  { name: 'Detva',           slug: 'detva',           locative: 'v Detve',            published: false },
  { name: 'Tisovec',         slug: 'tisovec',         locative: 'v Tisovci',          published: false },
  { name: 'Hnúšťa',          slug: 'hnusta',          locative: 'v Hnúšti',           published: false },
];

export const publishedLocations = plannedLocations.filter((l) => l.published);
