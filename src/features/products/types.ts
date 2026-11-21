/** A brand as embedded in a product. */
export type ProductBrand = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

/** A category as embedded in a product. */
export type ProductCategory = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
};

/** A subcategory as embedded in a product (references its category by id). */
export type ProductSubcategory = {
  _id: string;
  name: string;
  slug: string;
  category: string;
};

export type Product = {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  /** Present when the product is discounted. */
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  sold: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  category: ProductCategory;
  brand: ProductBrand;
  subcategory: ProductSubcategory[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProductsMetadata = {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
};

export type ProductsResponse = {
  results: number;
  metadata: ProductsMetadata;
  data: Product[];
};

/**
 * Query accepted by `GET /products`.
 *
 * - `sort` takes a field, prefixed with `-` for descending (`"-price"`).
 * - `fields` becomes a comma-separated projection (`title,price`).
 * - `category` becomes a repeated `category[in]` filter.
 * - `priceGte` / `priceLte` become the `price[gte]` / `price[lte]` filters.
 */
export type ProductsQuery = {
  limit?: number;
  page?: number;
  sort?: string;
  fields?: string[];
  keyword?: string;
  brand?: string;
  category?: string[];
  priceGte?: number;
  priceLte?: number;
};

/** A product stored in the local cart. */
export type CartItem = {
  id: string;
  quantity: number;
};

/** Raw `searchParams` for the shop page (`?page=`, `?category=`, `?search=`). */
export type ProductsSearchParams = {
  [key: string]: string | string[] | undefined;
};
