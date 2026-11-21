"use client";

import { useState } from "react";
import Button from "@components/ui/Button";
import Label from "@components/ui/Label";
import type { ReviewInput } from "../types";
import RatingStars from "./RatingStars";

type ReviewFormProps = {
  initial?: ReviewInput;
  submitLabel: string;
  submitting: boolean;
  serverError: string | null;
  onSubmit: (input: ReviewInput) => void;
};

/** Rating selector + review textarea with client-side validation. */
const ReviewForm = ({
  initial,
  submitLabel,
  submitting,
  serverError,
  onSubmit,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [review, setReview] = useState(initial?.review ?? "");
  const [errors, setErrors] = useState<{ rating?: string; review?: string }>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: typeof errors = {};

    if (!rating || rating < 1 || rating > 5) {
      nextErrors.rating = "Please select a rating from 1 to 5.";
    }

    if (review.trim().length < 3) {
      nextErrors.review = "Please write a review of at least 3 characters.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({ rating, review: review.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label required>Your rating</Label>
        <RatingStars value={rating} onChange={setRating} />
        {errors.rating && (
          <p role="alert" className="text-sm text-red-500">
            {errors.rating}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="review-text" required>
          Your review
        </Label>
        <textarea
          id="review-text"
          value={review}
          onChange={(event) => setReview(event.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Share what you liked or disliked…"
          disabled={submitting}
          aria-invalid={errors.review ? true : undefined}
          className={[
            "w-full resize-none rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-700",
            "placeholder:text-gray-400 transition-colors",
            "focus:bg-white focus:outline-none focus:ring-2",
            "disabled:cursor-not-allowed disabled:opacity-60",
            errors.review
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-200 focus:border-primary-500 focus:ring-primary-500/20",
          ].join(" ")}
        />
        {errors.review ? (
          <p role="alert" className="text-sm text-red-500">
            {errors.review}
          </p>
        ) : (
          <p className="text-xs text-gray-400">{review.length}/500</p>
        )}
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
};

export default ReviewForm;
