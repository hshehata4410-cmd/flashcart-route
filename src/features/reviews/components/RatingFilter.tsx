"use client";

import type { RatingBreakdown } from "@api/reviews";
import RatingStars from "./RatingStars";

type RatingFilterProps = {
  breakdown: RatingBreakdown;
  /** Active star filter, or null for all ratings. */
  activeRating: number | null;
  onSelect: (rating: number | null) => void;
  disabled?: boolean;
};

/**
 * Amazon-style rating filter: one row per star with a distribution bar and
 * share. Selecting a row filters the list; selecting it again clears.
 */
const RatingFilter = ({
  breakdown,
  activeRating,
  onSelect,
  disabled = false,
}: RatingFilterProps) => {
  const total = [1, 2, 3, 4, 5].reduce(
    (sum, rating) => sum + (breakdown[rating as 1 | 2 | 3 | 4 | 5] ?? 0),
    0,
  );

  return (
    <div aria-label="Filter reviews by rating">
      <h3 className="text-sm font-bold text-gray-900">Filter by rating</h3>

      <ul className="mt-3 space-y-1">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count =
            breakdown[rating as 1 | 2 | 3 | 4 | 5] ?? 0;
          const percent = total === 0 ? 0 : Math.round((count / total) * 100);
          const active = activeRating === rating;

          return (
            <li key={rating}>
              <button
                type="button"
                onClick={() => onSelect(active ? null : rating)}
                disabled={disabled}
                aria-pressed={active}
                aria-label={`Show ${rating}-star reviews (${count})`}
                title={`${percent}% of reviews are ${rating} star`}
                className={[
                  "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
                  "disabled:cursor-wait disabled:opacity-60",
                  active
                    ? "bg-primary-50 ring-1 ring-primary-600"
                    : "hover:bg-gray-50",
                ].join(" ")}
              >
                <span
                  className={`w-12 shrink-0 text-xs font-semibold ${active ? "text-primary-700" : "text-gray-600"}`}
                >
                  {rating} star
                </span>
                <span
                  aria-hidden="true"
                  className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-100"
                >
                  <span
                    className={`block h-full rounded-full transition-[width] ${active ? "bg-primary-600" : "bg-amber-400"}`}
                    style={{ width: `${percent}%` }}
                  />
                </span>
                <span className="w-10 shrink-0 text-right text-xs text-gray-400">
                  {percent}%
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {activeRating !== null && (
        <button
          type="button"
          onClick={() => onSelect(null)}
          disabled={disabled}
          className="mt-3 inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-primary-600 hover:text-primary-600 disabled:cursor-wait disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1.5 text-gray-700"
          >
            <RatingStars value={activeRating} size="size-3" />
          </span>
          Clear filter
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
};

export default RatingFilter;
