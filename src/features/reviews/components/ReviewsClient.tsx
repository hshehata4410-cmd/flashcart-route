"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import {
  REVIEWS_PER_PAGE,
  createProductReview,
  deleteReview,
  getProductReviews,
  getRatingBreakdown,
  updateReview,
  type RatingBreakdown,
} from "@api/reviews";
import { getApiErrorMessage } from "@api/axios";
import { useAuth } from "@features/auth/utils/useAuth";
import { readAuthToken } from "@features/auth/utils/session";
import type { Review, ReviewInput } from "../types";
import { useCurrentUserId } from "../utils/useCurrentUserId";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import RatingFilter from "./RatingFilter";
import ReviewsPagination from "./ReviewsPagination";
import RatingStars from "./RatingStars";

const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please sign in again.";

type Dialog =
  | { mode: "add" }
  | { mode: "edit"; review: Review }
  | { mode: "delete"; review: Review };

type ReviewsClientProps = {
  productId: string;
  initialReviews: Review[];
  initialTotalResults: number;
  initialTotalPages: number;
  initialBreakdown: RatingBreakdown;
  initialError: string | null;
};

const ListSkeleton = () => (
  <div aria-hidden="true" className="grid animate-pulse gap-4">
    {[0, 1].map((index) => (
      <div key={index} className="rounded-2xl border border-gray-100 p-5">
        <div className="h-4 w-1/4 rounded bg-gray-100" />
        <div className="mt-2 h-3 w-1/3 rounded bg-gray-100" />
        <div className="mt-3 h-3 w-full rounded bg-gray-100" />
      </div>
    ))}
  </div>
);

/**
 * Interactive reviews list: public reviews with paging and star-rating
 * filters, plus add/edit/delete for signed-in users. State starts from the
 * server-loaded first page; page changes, filters, and refreshes happen in
 * event handlers.
 */
const ReviewsClient = ({
  productId,
  initialReviews,
  initialTotalResults,
  initialTotalPages,
  initialBreakdown,
  initialError,
}: ReviewsClientProps) => {
  const { isAuthenticated } = useAuth();
  const currentUserId = useCurrentUserId();
  const topRef = useRef<HTMLDivElement>(null);

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [totalResults, setTotalResults] = useState(initialTotalResults);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [breakdown, setBreakdown] =
    useState<RatingBreakdown>(initialBreakdown);
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(initialError);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const fetchPage = async (nextPage: number, nextRating: number | null) => {
    setPageLoading(true);
    setLoadError(null);

    try {
      const response = await getProductReviews(productId, {
        page: nextPage,
        limit: REVIEWS_PER_PAGE,
        rating: nextRating ?? undefined,
      });

      setReviews(response.data);
      setTotalResults(response.results);
      setTotalPages(response.metadata?.numberOfPages ?? 1);
      setPage(nextPage);
      setRatingFilter(nextRating);
      scrollToTop();
    } catch (error) {
      setLoadError(
        getApiErrorMessage(error, "Unable to load reviews right now."),
      );
    } finally {
      setPageLoading(false);
    }
  };

  const refreshBreakdown = async () => {
    setBreakdown(await getRatingBreakdown(productId));
  };

  const closeDialog = () => {
    if (submitting) return;
    setDialog(null);
    setFormError(null);
  };

  const handleSubmit = async (input: ReviewInput) => {
    setSubmitting(true);
    setFormError(null);

    try {
      const token = readAuthToken();
      if (!token) throw new Error(SESSION_EXPIRED_MESSAGE);

      if (dialog?.mode === "edit") {
        await updateReview(token, dialog.review._id, input);
        const response = await getProductReviews(productId, {
          page,
          limit: REVIEWS_PER_PAGE,
          rating: ratingFilter ?? undefined,
        });
        setReviews(response.data);
        setTotalResults(response.results);
        setTotalPages(response.metadata?.numberOfPages ?? 1);
      } else {
        await createProductReview(token, productId, input);
        // New reviews surface on the first page, so reset there unfiltered.
        const response = await getProductReviews(productId, {
          page: 1,
          limit: REVIEWS_PER_PAGE,
        });
        setReviews(response.data);
        setTotalResults(response.results);
        setTotalPages(response.metadata?.numberOfPages ?? 1);
        setPage(1);
        setRatingFilter(null);
        scrollToTop();
      }

      await refreshBreakdown();
      setDialog(null);
    } catch (error) {
      setFormError(
        error instanceof Error && error.message === SESSION_EXPIRED_MESSAGE
          ? SESSION_EXPIRED_MESSAGE
          : getApiErrorMessage(error, "Unable to save your review."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (dialog?.mode !== "delete") return;

    setSubmitting(true);
    setFormError(null);

    try {
      const token = readAuthToken();
      if (!token) throw new Error(SESSION_EXPIRED_MESSAGE);

      await deleteReview(token, dialog.review._id);

      // When the last item on a page is removed, step back one page.
      const nextPage =
        reviews.length <= 1 && page > 1 ? page - 1 : page;
      const response = await getProductReviews(productId, {
        page: nextPage,
        limit: REVIEWS_PER_PAGE,
        rating: ratingFilter ?? undefined,
      });

      setReviews(response.data);
      setTotalResults(response.results);
      setTotalPages(response.metadata?.numberOfPages ?? 1);
      setPage(nextPage);
      await refreshBreakdown();
      setDialog(null);
    } catch (error) {
      setFormError(
        error instanceof Error && error.message === SESSION_EXPIRED_MESSAGE
          ? SESSION_EXPIRED_MESSAGE
          : getApiErrorMessage(error, "Unable to delete your review."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const breakdownTotal = [1, 2, 3, 4, 5].reduce(
    (sum, rating) => sum + (breakdown[rating as 1 | 2 | 3 | 4 | 5] ?? 0),
    0,
  );
  const breakdownAverage =
    breakdownTotal === 0
      ? 0
      : [1, 2, 3, 4, 5].reduce(
          (sum, rating) =>
            sum + rating * (breakdown[rating as 1 | 2 | 3 | 4 | 5] ?? 0),
          0,
        ) / breakdownTotal;

  const hasAnyReviews =
    breakdownTotal > 0 || reviews.length > 0 || ratingFilter !== null;
  const busy = pageLoading || submitting;

  return (
    <>
      <div
        ref={topRef}
        className="flex scroll-mt-24 flex-wrap items-center justify-between gap-3"
      >
        <div className="flex flex-wrap items-center gap-3">
          <h2
            id="reviews-heading"
            className="text-lg font-bold text-gray-900 sm:text-xl"
          >
            Reviews
          </h2>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
            {breakdownTotal} {breakdownTotal === 1 ? "review" : "reviews"}
          </span>
          {breakdownTotal > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <RatingStars value={breakdownAverage} />
              <span className="font-semibold text-gray-700">
                {breakdownAverage.toFixed(1)}
              </span>
            </span>
          )}
          {ratingFilter !== null && (
            <button
              type="button"
              onClick={() => void fetchPage(1, null)}
              disabled={busy}
              className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 ring-1 ring-primary-600 transition-colors hover:bg-primary-100 disabled:cursor-wait disabled:opacity-60"
            >
              {ratingFilter}-star only ×
            </button>
          )}
        </div>

        {isAuthenticated && !loadError && (
          <Button
            type="button"
            onClick={() => {
              setFormError(null);
              setDialog({ mode: "add" });
            }}
            className="!px-4 !py-2 text-xs"
          >
            Write a review
          </Button>
        )}
      </div>

      {loadError ? (
        <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
          <p className="text-sm font-semibold text-gray-700">{loadError}</p>
          <button
            type="button"
            onClick={() => void fetchPage(page, ratingFilter)}
            className="mt-4 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-primary-600 hover:text-primary-600"
          >
            Try again
          </button>
        </div>
      ) : !hasAnyReviews ? (
        <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
          <p className="text-sm font-semibold text-gray-700">No reviews yet</p>
          <p className="mt-1 text-sm text-gray-400">
            {isAuthenticated
              ? "Be the first to share your experience with this product."
              : "Sign in to be the first to review this product."}
          </p>
          {!isAuthenticated && (
            <Link
              href="/login"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700"
            >
              Sign in
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-5 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
          <aside>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:sticky lg:top-24">
              <RatingFilter
                breakdown={breakdown}
                activeRating={ratingFilter}
                onSelect={(rating) => void fetchPage(1, rating)}
                disabled={busy}
              />
            </div>
          </aside>

          <div aria-busy={pageLoading || undefined}>
            {pageLoading ? (
              <ListSkeleton />
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
                <p className="text-sm font-semibold text-gray-700">
                  No {ratingFilter}-star reviews yet
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Try a different rating, or clear the filter to see all
                  reviews.
                </p>
                <button
                  type="button"
                  onClick={() => void fetchPage(1, null)}
                  className="mt-4 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-primary-600 hover:text-primary-600"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              <ul className="grid gap-4">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    isOwner={
                      isAuthenticated &&
                      currentUserId !== null &&
                      review.user?._id === currentUserId
                    }
                    onEdit={() => {
                      setFormError(null);
                      setDialog({ mode: "edit", review });
                    }}
                    onDelete={() => {
                      setFormError(null);
                      setDialog({ mode: "delete", review });
                    }}
                  />
                ))}
              </ul>
            )}

            <ReviewsPagination
              page={page}
              totalPages={totalPages}
              totalResults={totalResults}
              perPage={REVIEWS_PER_PAGE}
              disabled={busy}
              onChange={(nextPage) => void fetchPage(nextPage, ratingFilter)}
            />
          </div>
        </div>
      )}

      {!isAuthenticated && !loadError && totalResults > 0 && (
        <p className="mt-5 rounded-2xl bg-gray-50 px-4 py-3 text-center text-sm text-gray-500">
          Want to share your experience?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary-600 hover:text-primary-700"
          >
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      )}

      <Modal
        open={dialog?.mode === "add" || dialog?.mode === "edit"}
        onClose={closeDialog}
        title={dialog?.mode === "edit" ? "Edit your review" : "Write a review"}
      >
        <ReviewForm
          key={dialog?.mode === "edit" ? dialog.review._id : "new"}
          initial={
            dialog?.mode === "edit"
              ? { review: dialog.review.review, rating: dialog.review.rating }
              : undefined
          }
          submitLabel={
            dialog?.mode === "edit" ? "Save changes" : "Submit review"
          }
          submitting={submitting}
          serverError={formError}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={dialog?.mode === "delete"}
        onClose={closeDialog}
        title="Delete review"
      >
        {dialog?.mode === "delete" && (
          <div>
            {formError && (
              <p
                role="alert"
                className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {formError}
              </p>
            )}
            <p className="text-sm leading-6 text-gray-600">
              Delete your review? This cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={closeDialog}
                disabled={submitting}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                aria-busy={submitting}
                className="flex-1 rounded-full bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600 disabled:cursor-wait disabled:opacity-70"
              >
                {submitting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ReviewsClient;
