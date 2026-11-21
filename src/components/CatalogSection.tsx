import Link from "next/link";
import { getBrands, getCategories } from "@api/catalog";
import Pagination from "@components/Pagination";
import type { CatalogItem, CatalogKind, CatalogSearchParams } from "@features/catalog/types";
import { firstValue, paginate, parsePage } from "@features/catalog/utils/params";
import { matchesKeyword } from "@features/catalog/utils/search";
import CatalogGrid from "./CatalogGrid";
import CatalogSearch from "./CatalogSearch";

const PAGE_SIZE = 12;

type CatalogConfig = {
  noun: string;
  plural: string;
  placeholder: string;
  emptyTitle: string;
  emptyHint: string;
  load: () => Promise<CatalogItem[]>;
  /** Where a card points: the product list filtered by that item. */
  hrefFor: (id: string) => string;
};

const CONFIG: Record<CatalogKind, CatalogConfig> = {
  categories: {
    noun: "category",
    plural: "categories",
    placeholder: "Search categories...",
    emptyTitle: "No categories yet",
    emptyHint: "Check back soon for new categories.",
    load: getCategories,
    hrefFor: (id) => `/products?category=${id}`,
  },
  brands: {
    noun: "brand",
    plural: "brands",
    placeholder: "Search brands...",
    emptyTitle: "No brands yet",
    emptyHint: "Check back soon for new brands.",
    load: getBrands,
    hrefFor: (id) => `/products?brand=${id}`,
  },
};

const CatalogSection = async ({
  kind,
  searchParams,
}: {
  kind: CatalogKind;
  searchParams: Promise<CatalogSearchParams>;
}) => {
  const config = CONFIG[kind];
  const params = await searchParams;

  const keyword = firstValue(params.keyword)?.trim();
  const requestedPage = parsePage(params.page);

  let items: CatalogItem[];

  try {
    items = await config.load();
  } catch {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
        <p className="text-sm font-medium text-gray-700">
          Unable to load {config.plural} right now.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Please try again in a moment.
        </p>
      </div>
    );
  }

  const filtered = items.filter((item) => matchesKeyword(item, keyword));
  const { pageItems, currentPage, totalPages } = paginate(
    filtered,
    requestedPage,
    PAGE_SIZE,
  );

  const cards = pageItems.map((item) => ({
    id: item._id,
    name: item.name,
    image: item.image,
    href: config.hrefFor(item._id),
  }));

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length === 1 ? config.noun : config.plural}
          {keyword && (
            <>
              {" "}
              for <span className="font-semibold text-gray-700">{keyword}</span>
            </>
          )}
        </p>

        <CatalogSearch
          key={keyword ?? ""}
          label={`Search ${config.plural}`}
          placeholder={config.placeholder}
          className="w-full sm:w-80"
        />
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <p className="text-sm font-medium text-gray-600">
            {keyword
              ? `No ${config.plural} match “${keyword}”`
              : config.emptyTitle}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {keyword ? "Try a different search term." : config.emptyHint}
          </p>
          {keyword && (
            <Link
              href={`/${kind}`}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700"
            >
              Clear search
            </Link>
          )}
        </div>
      ) : (
        <CatalogGrid items={cards} kind={kind} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        className="mt-10"
      />
    </div>
  );
};

export default CatalogSection;
