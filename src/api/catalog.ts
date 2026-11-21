import type {
  Brand,
  CatalogResponse,
  Category,
} from "@features/catalog/types";
import { axios } from "./axios";

/** `GET /categories` and `GET /brands` cap `limit` at 50. */
const MAX_LIMIT = 50;

/**
 * Loads every page of a list endpoint.
 *
 * Both collections are small (10 categories, 54 brands), and the API ignores
 * the advertised `keyword` param on these routes — it always answers with zero
 * results. So the catalog is fetched once and searched in memory instead.
 */
const getAll = async <T>(path: string): Promise<T[]> => {
  const first = await axios.get<CatalogResponse<T>>(path, {
    params: { limit: MAX_LIMIT, page: 1 },
  });

  const numberOfPages = first.data.metadata.numberOfPages;

  if (numberOfPages <= 1) return first.data.data;

  const rest = await Promise.all(
    Array.from({ length: numberOfPages - 1 }, (_, index) =>
      axios.get<CatalogResponse<T>>(path, {
        params: { limit: MAX_LIMIT, page: index + 2 },
      }),
    ),
  );

  return [
    ...first.data.data,
    ...rest.flatMap((response) => response.data.data),
  ];
};

/** Lists every category (`GET /categories`). */
export const getCategories = () => getAll<Category>("/categories");

/** Lists every brand (`GET /brands`). */
export const getBrands = () => getAll<Brand>("/brands");
