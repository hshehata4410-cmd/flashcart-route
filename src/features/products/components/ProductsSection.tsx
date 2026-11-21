import { getProducts } from "@api/products";
import Pagination from "@components/Pagination";
import type { ProductsQuery, ProductsSearchParams } from "../types";
import ProductsList from "./ProductsList";
import ProductsSort from "./ProductsSort";

const PAGE_SIZE = 12;

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const toNumber = (value: string | undefined) => {
  if (value === undefined || value.trim() === "") return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

const ProductsSection = async ({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) => {
  const params = await searchParams;

  const requestedPage = Number(firstValue(params.page));
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const rawCategory = params.category;
  const categories =
    rawCategory === undefined
      ? undefined
      : Array.isArray(rawCategory)
        ? rawCategory
        : [rawCategory];

  const keyword = firstValue(params.search) ?? firstValue(params.keyword);

  const query: ProductsQuery = {
    page,
    limit: PAGE_SIZE,
    keyword,
    category: categories?.length ? categories : undefined,
    brand: firstValue(params.brand) || undefined,
    sort: firstValue(params.sort) || undefined,
    priceGte: toNumber(firstValue(params["price[gte]"])),
    priceLte: toNumber(firstValue(params["price[lte]"])),
  };

  let response;

  try {
    response = await getProducts(query);
  } catch {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
        <p className="text-sm font-medium text-gray-700">
          Unable to load products right now.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Please try again in a moment.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <ProductsSort className="w-full sm:w-64" />
      </div>

      <ProductsList products={response.data} />
      <Pagination
        currentPage={response.metadata.currentPage}
        totalPages={response.metadata.numberOfPages}
        className="mt-10"
      />
    </div>
  );
};

export default ProductsSection;
