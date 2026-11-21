import type { CatalogItem } from "../types";

/**
 * Case-insensitive match against a category or brand name/slug.
 *
 * Runs in memory because the list endpoints don't actually implement their
 * advertised `keyword` filter.
 */
export const matchesKeyword = (
  item: Pick<CatalogItem, "name" | "slug">,
  keyword?: string,
) => {
  const term = keyword?.trim().toLowerCase();

  if (!term) return true;

  return (
    item.name.toLowerCase().includes(term) ||
    item.slug.toLowerCase().includes(term)
  );
};
