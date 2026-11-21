"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Select from "@components/ui/Select";

const SORT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Top Rated", value: "-ratingsAverage" },
  { label: "Newest", value: "-createdAt" },
];

/**
 * Sort control above the product grid. Applies immediately (unlike the filter
 * panel, which waits for Apply) and resets paging so the sorted list starts at
 * page one.
 */
const ProductsSort = ({ className }: { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const value = searchParams.get("sort") ?? "";

  const handleChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    params.delete("page");

    const query = params.toString();

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  return (
    <div
      className={[
        "flex items-center gap-2 transition-opacity",
        isPending ? "opacity-60" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label
        htmlFor="products-sort"
        className="shrink-0 text-sm font-medium text-gray-500"
      >
        Sort by
      </label>
      <Select
        id="products-sort"
        options={SORT_OPTIONS}
        value={value}
        onChange={handleChange}
        className="min-w-0 flex-1"
      />
    </div>
  );
};

export default ProductsSort;
