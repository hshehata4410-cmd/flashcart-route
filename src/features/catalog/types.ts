/** Shape shared by the categories and brands list endpoints. */
export type CatalogItem = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

/** A category as returned by `GET /categories`. */
export type Category = CatalogItem;

/** A brand as returned by `GET /brands`. */
export type Brand = CatalogItem;

/** Which collection a catalog page shows; also its URL segment. */
export type CatalogKind = "categories" | "brands";

/** Metadata shared by the list endpoints. */
export type CatalogMetadata = {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
};

export type CatalogResponse<T> = {
  results: number;
  metadata: CatalogMetadata;
  data: T[];
};

/** Raw `searchParams` for the categories and brands pages (`?page=`, `?keyword=`). */
export type CatalogSearchParams = {
  [key: string]: string | string[] | undefined;
};
