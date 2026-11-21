/** First value of a possibly repeated query param. */
export const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Reads `?page=` defensively, always returning a positive integer. */
export const parsePage = (value: string | string[] | undefined) => {
  const parsed = Number(firstValue(value));

  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
};

/**
 * Slices an in-memory list into one page, clamping out-of-range pages so a
 * stale `?page=` never renders an empty grid.
 */
export const paginate = <T>(
  items: T[],
  requestedPage: number,
  pageSize: number,
) => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    pageItems: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
  };
};
