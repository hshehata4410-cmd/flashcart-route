/** A user embedded in a review. */
export type ReviewUser = {
  _id: string;
  name: string;
};

export type Review = {
  _id: string;
  review: string;
  rating: number;
  product: string;
  user: ReviewUser;
  createdAt: string;
  updatedAt: string;
};

export type ReviewsMetadata = {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
};

export type ReviewsResponse = {
  results: number;
  metadata: ReviewsMetadata;
  data: Review[];
};

/** Payload for creating or updating a review (`review` text + `rating` 1-5). */
export type ReviewInput = {
  review: string;
  rating: number;
};
