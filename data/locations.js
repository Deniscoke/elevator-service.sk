/**
 * CENTRÁLNA DÁTOVÁ VRSTVA — lokality a servisná oblasť
 *
 * ZÁMERNE NEGENERUJEME doorway stránky pre každé mesto.
 * Lokalitná stránka vznikne až vtedy, keď k nej budeme mať reálny obsah
 * (referencie z mesta, konkrétne zariadenia, dostupnosť technika).
 * Architektúra je pripravená: stačí prepnúť `published: true`.
 */

export const serviceArea = {
  centerCity: 'Banská Bystrica',
  radiusKm: 80,
  // false = na webe sa polomer NEUVÁDZA ako fakt, len sa spomína región.
  confirmed: false,
  // Text, ktorý sa zobrazí, kým nie je oblasť potvrdená.
  provisionalLabel: 'Banská Bystrica a okolie',
  // Text, ktorý sa použije po potvrdení (radiusKm sa doplní automaticky).
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
 * Plánované lokalitné stránky — /servis-vytahov/<slug>/
 * published: false → stránka sa negeneruje a nie je v sitemap.
 */
export const plannedLocations = [
  { name: 'Zvolen',           slug: 'zvolen',            locative: 'vo Zvolene',           published: false },
  { name: 'Brezno',           slug: 'brezno',            locative: 'v Brezne',             published: false },
  { name: 'Žiar nad Hronom',  slug: 'ziar-nad-hronom',   locative: 'v Žiari nad Hronom',   published: false },
  { name: 'Detva',            slug: 'detva',             locative: 'v Detve',              published: false },
  { name: 'Banská Štiavnica', slug: 'banska-stiavnica',  locative: 'v Banskej Štiavnici',  published: false },
];

export const publishedLocations = plannedLocations.filter((l) => l.published);
