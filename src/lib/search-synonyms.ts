export const SYNONYM_MAP: Record<string, string[]> = {
  tire: ["tyre"],
  tires: ["tyres"],
  tyre: ["tire"],
  tyres: ["tires"],
  suv: ["4x4", "4wd", "off-road", "offroad", "crossover"],
  "4x4": ["suv", "4wd", "off-road", "offroad"],
  "4wd": ["4x4", "suv", "off-road", "offroad"],
  "off-road": ["offroad", "4x4", "suv", "4wd"],
  sedan: ["saloon"],
  saloon: ["sedan"],
  winter: ["snow", "cold"],
  snow: ["winter", "cold"],
  "all-season": ["allseason", "touring", "grand touring"],
  "all weather": ["all-weather", "allseason"],
  performance: ["sport", "high-performance"],
  sport: ["performance", "high-performance"],
  summer: ["performance"],
  "run-flat": ["runflat", "run flat", "self-supporting"],
  runflat: ["run-flat", "run flat"],
  "light truck": ["lt", "light-truck"],
  lt: ["light truck", "light-truck"],
  truck: ["pickup", "light truck", "lt"],
  pickup: ["truck"],
  "all-terrain": ["allterrain", "a/t", "at", "mud-terrain"],
  "mud-terrain": ["mudterrain", "m/t", "mt", "all-terrain"],
  "a/t": ["all-terrain", "allterrain", "at"],
  "m/t": ["mud-terrain", "mudterrain", "mt"],
  highway: ["hwy", "road"],
  touring: ["grand touring", "all-season"],
  luxury: ["premium", "high-end"],
  budget: ["economy", "value", "affordable"],
  economy: ["budget", "value"],
};

export function expandSynonyms(query: string): string[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const expanded = new Set<string>();
  for (const word of words) {
    expanded.add(word);
    const synonyms = SYNONYM_MAP[word];
    if (synonyms) {
      for (const syn of synonyms) {
        expanded.add(syn);
      }
    }
  }
  return [...expanded];
}
