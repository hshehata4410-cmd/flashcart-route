"use client";

import type { Review } from "../types";
import RatingStars from "./RatingStars";

type ReviewCardProps = {
  review: Review;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

/** A single review with the author's name, rating, and owner actions. */
const ReviewCard = ({ review, isOwner, onEdit, onDelete }: ReviewCardProps) => {
  const created = formatDate(review.createdAt);

  return (
    <li className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {review.user?.name ?? "Verified buyer"}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <RatingStars value={review.rating} />
            {created && (
              <span className="text-xs text-gray-400">{created}</span>
            )}
          </div>
        </div>
        {isOwner && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-primary-600 hover:text-primary-600"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-600">{review.review}</p>
    </li>
  );
};

export default ReviewCard;
