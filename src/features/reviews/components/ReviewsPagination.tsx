"use client";

type ReviewsPaginationProps = {
  page: number;
  totalPages: number;
  totalResults: number;
  perPage: number;
  disabled?: boolean;
  onChange: (page: number) => void;
};

/** Compact page items: all pages when few, otherwise 1 … window … last. */
const getPageItems = (
  page: number,
  totalPages: number,
): (number | "ellipsis")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const window = new Set<number>([1, totalPages, page - 1, page, page + 1]);

  const items: (number | "ellipsis")[] = [];
  let previous = 0;

  for (const candidate of [...window].sort((a, b) => a - b)) {
    if (candidate < 1 || candidate > totalPages) continue;
    if (candidate - previous > 1) items.push("ellipsis");
    items.push(candidate);
    previous = candidate;
  }

  return items;
};

/** "Showing X–Y of Z" with prev / page / next controls. */
const ReviewsPagination = ({
  page,
  totalPages,
  totalResults,
  perPage,
  disabled = false,
  onChange,
}: ReviewsPaginationProps) => {
  if (totalPages <= 1) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalResults);

  const buttonClasses = (active: boolean) =>
    [
      "flex min-w-9 items-center justify-center rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
      "disabled:cursor-wait disabled:opacity-50",
      active
        ? "bg-primary-600 text-white shadow-sm shadow-primary-600/20"
        : "text-gray-600 hover:bg-gray-100",
    ].join(" ");

  return (
    <nav
      aria-label="Reviews pages"
      className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
    >
      <p className="text-xs text-gray-400" aria-live="polite">
        Showing {start}–{end} of {totalResults}{" "}
        {totalResults === 1 ? "review" : "reviews"}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Previous page"
          className="mr-1 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:border-primary-600 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Prev
        </button>

        {getPageItems(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="px-1 text-sm text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              disabled={disabled}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              className={buttonClasses(item === page)}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={disabled || page >= totalPages}
          aria-label="Next page"
          className="ml-1 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-600 transition-colors hover:border-primary-600 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </nav>
  );
};

export default ReviewsPagination;
