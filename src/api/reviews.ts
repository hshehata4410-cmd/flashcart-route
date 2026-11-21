import type { ReviewsResponse } from "@features/reviews/types";
import { axios } from "./axios";

const withToken = (token: string) => ({ headers: { token } });

/** Number of reviews shown per page in the product reviews section. */
export const REVIEWS_PER_PAGE = 5;

export type ProductReviewsQuery = {
  page?: number;
  limit?: number;
  /** Only return reviews with this star rating (1-5). */
  rating?: number;
};

/**
 * Lists the reviews for a product (`GET /products/:productId/reviews`) with
 * paging (`page`, `limit`) and an optional star-rating filter (`rating`).
 */
export const getProductReviews = async (
  productId: string,
  query: ProductReviewsQuery = {},
): Promise<ReviewsResponse> => {
  const { data } = await axios.get<ReviewsResponse>(
    `/products/${productId}/reviews`,
    {
      params: {
        page: query.page,
        limit: query.limit,
        rating: query.rating,
      },
    },
  );

  return data;
};

/** Star-rating counts for a product, used for the filter breakdown. */
export type RatingBreakdown = Record<1 | 2 | 3 | 4 | 5, number>;

/**
 * Counts reviews per star rating (`GET /products/:productId/reviews` with
 * `rating=N&limit=1`, reading the `results` total). A failing bucket counts
 * as zero so one bad response never breaks the whole breakdown.
 */
export const getRatingBreakdown = async (
  productId: string,
): Promise<RatingBreakdown> => {
  const ratings = [1, 2, 3, 4, 5] as const;

  const entries = await Promise.all(
    ratings.map(async (rating) => {
      try {
        const { data } = await axios.get<ReviewsResponse>(
          `/products/${productId}/reviews`,
          { params: { rating, limit: 1 } },
        );

        return [rating, data.results ?? 0] as const;
      } catch {
        return [rating, 0] as const;
      }
    }),
  );

  return Object.fromEntries(entries) as RatingBreakdown;
};

/**
 * Creates a review for a product (`POST /products/:productId/reviews`).
 * Requires a signed-in user.
 */
export const createProductReview = async (
  token: string,
  productId: string,
  input: { review: string; rating: number },
): Promise<void> => {
  await axios.post(
    `/products/${productId}/reviews`,
    input,
    withToken(token),
  );
};

/**
 * Updates a review owned by the signed-in user (`PUT /reviews/:reviewId`).
 */
export const updateReview = async (
  token: string,
  reviewId: string,
  input: { review: string; rating: number },
): Promise<void> => {
  await axios.put(`/reviews/${reviewId}`, input, withToken(token));
};

/**
 * Deletes a review owned by the signed-in user (`DELETE /reviews/:reviewId`).
 */
export const deleteReview = async (
  token: string,
  reviewId: string,
): Promise<void> => {
  await axios.delete(`/reviews/${reviewId}`, withToken(token));
};
