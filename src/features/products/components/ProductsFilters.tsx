"use client";

import { useEffect, useMemo, useState, useTransition, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getBrands, getCategories } from "@api/catalog";
import Select from "@components/ui/Select";
import type { FilterOption } from "../utils/filters";

const fieldClasses =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20";

type FilterDraft = {
  categories: string[];
  brand: string;
  minPrice: string;
  maxPrice: string;
};

type SearchParamsReader = {
  getAll(name: string): string[];
  get(name: string): string | null;
};

const EMPTY_DRAFT: FilterDraft = {
  categories: [],
  brand: "",
  minPrice: "",
  maxPrice: "",
};

const getDraft = (params: SearchParamsReader): FilterDraft => ({
  categories: params.getAll("category"),
  brand: params.get("brand") ?? "",
  minPrice: params.get("price[gte]") ?? "",
  maxPrice: params.get("price[lte]") ?? "",
});

const hasActiveFilters = (draft: FilterDraft) =>
  Boolean(
    draft.categories.length ||
      draft.brand ||
      draft.minPrice ||
      draft.maxPrice,
  );

const toFilterOptions = <T extends { _id: string; name: string }>(
  items: T[],
): FilterOption[] =>
  items
    .map((item) => ({ label: item.name, value: item._id }))
    .sort((a, b) => a.label.localeCompare(b.label));

const FilterForm = ({
  categories,
  brands,
  loadingOptions,
}: {
  categories: FilterOption[];
  brands: FilterOption[];
  loadingOptions: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [draft, setDraft] = useState<FilterDraft>(() => getDraft(searchParams));
  const [isApplying, startApplying] = useTransition();

  /**
   * Options loaded from the API, plus an "All" entry as the cleared value. A
   * selected id that isn't in the list (e.g. an item that was removed) is kept
   * selectable so the control never misreports the applied filter.
   */
  const brandOptions = useMemo<FilterOption[]>(() => {
    const options = [{ label: "All brands", value: "" }, ...brands];

    if (draft.brand && !options.some((option) => option.value === draft.brand)) {
      options.push({ label: "Selected brand", value: draft.brand });
    }

    return options;
  }, [brands, draft.brand]);

  const categoryOptions = useMemo<FilterOption[]>(() => {
    const known = new Set(categories.map((option) => option.value));
    const missing = draft.categories
      .filter((value) => !known.has(value))
      .map((value) => ({ label: "Selected category", value }));

    return [...categories, ...missing];
  }, [categories, draft.categories]);

  const updateDraft = (patch: Partial<FilterDraft>) =>
    setDraft((current) => ({ ...current, ...patch }));

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    draft.categories.forEach((category) =>
      params.append("category", category),
    );

    params.delete("brand");
    if (draft.brand) params.set("brand", draft.brand);

    params.delete("price[gte]");
    const minPrice = draft.minPrice.trim();
    if (minPrice) params.set("price[gte]", minPrice);

    params.delete("price[lte]");
    const maxPrice = draft.maxPrice.trim();
    if (maxPrice) params.set("price[lte]", maxPrice);

    // Any filter change starts the list over at the first page.
    params.delete("page");

    const query = params.toString();

    startApplying(() => {
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    apply();
  };

  const clearAll = () => {
    // Clear only the filters this panel owns; sorting and search live outside it.
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("brand");
    params.delete("price[gte]");
    params.delete("price[lte]");
    params.delete("page");

    setDraft(EMPTY_DRAFT);

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const canClear =
    hasActiveFilters(draft) || hasActiveFilters(getDraft(searchParams));

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        {canClear && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label
            htmlFor="filter-categories"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Categories
          </label>
          <Select
            id="filter-categories"
            multiple
            options={categoryOptions}
            value={draft.categories}
            onChange={(categories) => updateDraft({ categories })}
            placeholder="All categories"
            loading={loadingOptions}
          />
        </div>

        <div>
          <label
            htmlFor="filter-brands"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Brands
          </label>
          <Select
            id="filter-brands"
            options={brandOptions}
            value={draft.brand}
            onChange={(brand) => updateDraft({ brand })}
            placeholder="All brands"
            loading={loadingOptions}
          />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">
            Price
          </span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={draft.minPrice}
              onChange={(event) =>
                updateDraft({ minPrice: event.target.value })
              }
              placeholder="Min"
              aria-label="Minimum price"
              className={fieldClasses}
            />
            <span className="text-gray-400">–</span>
            <input
              type="number"
              min={0}
              value={draft.maxPrice}
              onChange={(event) =>
                updateDraft({ maxPrice: event.target.value })
              }
              placeholder="Max"
              aria-label="Maximum price"
              className={fieldClasses}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isApplying}
        aria-busy={isApplying}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:cursor-wait disabled:opacity-70"
      >
        {isApplying ? (
          <>
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            Applying...
          </>
        ) : (
          "Apply"
        )}
      </button>
    </form>
  );
};

/**
 * Loads the category and brand options from the backend. Fetched once here —
 * above the key-remounted form — so applying filters or navigating back and
 * forth doesn't refetch the lists.
 *
 * Remounts the draft form when the applied filters in the URL change, so
 * browser navigation, navbar category links, and brand cards reset the controls
 * to what the list is actually filtered by.
 */
const ProductsFilters = () => {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [brands, setBrands] = useState<FilterOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.allSettled([getCategories(), getBrands()]).then(
      ([categoriesResult, brandsResult]) => {
        if (!active) return;

        if (categoriesResult.status === "fulfilled") {
          setCategories(toFilterOptions(categoriesResult.value));
        }

        if (brandsResult.status === "fulfilled") {
          setBrands(toFilterOptions(brandsResult.value));
        }

        setLoadingOptions(false);
      },
    );

    return () => {
      active = false;
    };
  }, []);

  return (
    <FilterForm
      key={JSON.stringify(getDraft(searchParams))}
      categories={categories}
      brands={brands}
      loadingOptions={loadingOptions}
    />
  );
};

export default ProductsFilters;
