import Fuse, { type IFuseOptions } from "fuse.js";
import type { Product } from "./catalog-types";
import { expandSynonyms } from "./search-synonyms";

const FUSE_OPTIONS: IFuseOptions<Product> = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "brand", weight: 0.3 },
    { name: "tags", weight: 0.15 },
    { name: "sku", weight: 0.1 },
    { name: "category", weight: 0.05 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
};

let fuseInstance: Fuse<Product> | null = null;
let currentProducts: Product[] | null = null;

function getFuse(products: Product[]): Fuse<Product> {
  if (!fuseInstance || currentProducts !== products) {
    fuseInstance = new Fuse(products, FUSE_OPTIONS);
    currentProducts = products;
  }
  return fuseInstance;
}

export function fuzzySearchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return [];
  const tokens = expandSynonyms(query);
  const fuse = getFuse(products);
  const seen = new Set<string>();
  const results: Product[] = [];
  for (const token of tokens) {
    const matches = fuse.search(token);
    for (const { item } of matches) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        results.push(item);
      }
    }
  }
  return results;
}
