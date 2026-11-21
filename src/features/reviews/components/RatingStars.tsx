"use client";

import StarIcon from "@svg/StarIcon";

type RatingStarsProps = {
  value: number;
  /** When provided, renders an interactive 1-5 selector. */
  onChange?: (rating: number) => void;
  size?: string;
};

/** Read-only stars, or an interactive selector when `onChange` is given. */
const RatingStars = ({ value, onChange, size = "size-4" }: RatingStarsProps) => {
  if (!onChange) {
    return (
      <span
        role="img"
        aria-label={`Rated ${value} out of 5`}
        className="inline-flex items-center gap-0.5"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`${size} ${star <= Math.round(value) ? "text-amber-400" : "text-gray-200"}`}
          />
        ))}
      </span>
    );
  }

  return (
    <div role="radiogroup" aria-label="Rating" className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            className="rounded-full p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
          >
            <StarIcon
              className={`size-7 transition-colors ${active ? "text-amber-400" : "text-gray-200 hover:text-amber-200"}`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
