import type {
  Product,
  ProductsQuery,
  ProductsResponse,
} from "@features/products/types";
import { axios } from "./axios";

/**
 * Serializes a products query for `GET /products`.
 *
 * Built by hand instead of letting axios serialize `params` so the API's
 * bracket filters (`category[in]`, `price[gte]`, …) keep their exact names and
 * repeated keys.
 */
export const buildProductsParams = (query: ProductsQuery = {}) => {
  const params = new URLSearchParams();

  const setNumber = (key: string, value?: number) => {
    if (value !== undefined) params.set(key, String(value));
  };

  setNumber("limit", query.limit);
  setNumber("page", query.page);
  setNumber("price[gte]", query.priceGte);
  setNumber("price[lte]", query.priceLte);

  if (query.sort) params.set("sort", query.sort);
  if (query.keyword) params.set("keyword", query.keyword);
  if (query.brand) params.set("brand", query.brand);
  if (query.fields?.length) params.set("fields", query.fields.join(","));

  for (const category of query.category ?? []) {
    params.append("category[in]", category);
  }

  return params;
};

/** Lists products (`GET /products`) with paging, sorting, and filtering. */
export const getProducts = async (
  query: ProductsQuery = {}
): Promise<ProductsResponse> => {
  const { data } = await axios.get<ProductsResponse>("/products", {
    params: buildProductsParams(query),
  });

  return data;
};

/** Fetches a single product (`GET /products/:id`). */
export const getProduct = async (productId: string): Promise<Product> => {
  const { data } = await axios.get<{ data: Product }>(
    `/products/${productId}`
  );

  return data.data;
};
