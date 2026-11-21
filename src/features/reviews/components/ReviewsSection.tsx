import {
  REVIEWS_PER_PAGE,
  getProductReviews,
  getRatingBreakdown,
} from "@api/reviews";
import { getApiErrorMessage } from "@api/axios";
import type { Review } from "../types";
import ReviewsClient from "./ReviewsClient";

/**
 * Product reviews section: the first page and the rating breakdown load on
 * the server so guests see content immediately; paging, filtering, and
 * add/edit/delete live in the client island and only render their controls
 * for signed-in users.
 */
const ReviewsSection = async ({ productId }: { productId: string }) => {
  let initialReviews: Review[] = [];
  let initialTotalResults = 0;
  let initialTotalPages = 1;
  let initialError: string | null = null;
  const initialBreakdown = await getRatingBreakdown(productId);

  try {
    const firstPage = await getProductReviews(productId, {
      page: 1,
      limit: REVIEWS_PER_PAGE,
    });

    initialReviews = firstPage.data;
    initialTotalResults = firstPage.results;
    initialTotalPages = firstPage.metadata?.numberOfPages ?? 1;
  } catch (error) {
    initialError = getApiErrorMessage(
      error,
      "Unable to load reviews right now.",
    );
  }

  return (
    <section aria-labelledby="reviews-heading" className="mt-12">
      <ReviewsClient
        key={productId}
        productId={productId}
        initialReviews={initialReviews}
        initialTotalResults={initialTotalResults}
        initialTotalPages={initialTotalPages}
        initialBreakdown={initialBreakdown}
        initialError={initialError}
      />
    </section>
  );
};

export default ReviewsSection;
