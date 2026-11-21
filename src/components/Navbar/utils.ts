import type { ActiveLocation, SearchParamsLike } from "./types";

/** For links that never carry filters, e.g. the mobile drawer. */
export const EMPTY_SEARCH_PARAMS: SearchParamsLike = new URLSearchParams();

/**
 * Whether `href` matches the current location.
 *
 * - The path must match exactly or as a parent segment (`/products` matches
 *   `/products/123`).
 * - Every query param written in the href must match the current URL.
 * - An href without a query string matches only when the URL has no params
 *   either, so `/products` and `/products?category=…` never both light up.
 *
 * The util knows nothing about specific routes or param names; the caller
 * passes in the location to validate against.
 */
export const isHrefActive = (
  href: string,
  { pathname, searchParams }: ActiveLocation,
): boolean => {
  const [path, query = ""] = href.split("?");

  if (pathname !== path && !pathname.startsWith(`${path}/`)) return false;

  const targetParams = new URLSearchParams(query);

  // No query in the link: only active on an unfiltered URL.
  if (targetParams.size === 0) {
    return [...searchParams.keys()].length === 0;
  }

  for (const [key, value] of targetParams) {
    if (searchParams.get(key) !== value) return false;
  }

  return true;
};
