"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Parameter that holds the page number in the URL. */
  pageParam?: string;
  className?: string;
};

type PageItem = number | "ellipsis";

const buildPageItems = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);

  for (const offset of [-1, 1]) {
    const page = currentPage + offset;

    if (page > 1 && page < totalPages) pages.add(page);
  }

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) items.push("ellipsis");
    items.push(page);
  });

  return items;
};

const Pagination = ({
  currentPage,
  totalPages,
  pageParam = "page",
  className,
}: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete(pageParam);
    } else {
      params.set(pageParam, String(page));
    }

    const query = params.toString();

    return query ? `${pathname}?${query}` : pathname;
  };

  const items = buildPageItems(currentPage, totalPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className={["flex items-center justify-center gap-1.5", className]
        .filter(Boolean)
        .join(" ")}
    >
      {isFirst ? (
        <span className="flex size-10 items-center justify-center rounded-full text-sm text-gray-300">
          Prev
        </span>
      ) : (
        <Link
          href={hrefFor(currentPage - 1)}
          prefetch={false}
          className="flex size-10 items-center justify-center rounded-full text-sm font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
        >
          Prev
        </Link>
      )}

      {items.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex size-10 items-center justify-center text-sm text-gray-400"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            prefetch={false}
            aria-current={item === currentPage ? "page" : undefined}
            className={[
              "flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
              item === currentPage
                ? "bg-primary-600 text-white shadow-sm shadow-primary-600/20"
                : "text-gray-600 hover:bg-primary-50 hover:text-primary-600",
            ].join(" ")}
          >
            {item}
          </Link>
        ),
      )}

      {isLast ? (
        <span className="flex size-10 items-center justify-center rounded-full text-sm text-gray-300">
          Next
        </span>
      ) : (
        <Link
          href={hrefFor(currentPage + 1)}
          prefetch={false}
          className="flex size-10 items-center justify-center rounded-full text-sm font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
        >
          Next
        </Link>
      )}
    </nav>
  );
};

export default Pagination;
