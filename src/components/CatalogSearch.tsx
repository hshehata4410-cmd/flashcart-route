"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchIcon from "@svg/SearchIcon";
import XMarkIcon from "@svg/XMarkIcon";

type CatalogSearchProps = {
  /** Visible label, also used as the input's accessible name. */
  label: string;
  placeholder: string;
  className?: string;
};

/**
 * Search box for the categories and brands pages. Writes `?keyword=` to the
 * URL and resets paging so a new search always starts at page one.
 */
const CatalogSearch = ({ label, placeholder, className }: CatalogSearchProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputId = useId();

  const appliedKeyword = searchParams.get("keyword") ?? "";
  const [value, setValue] = useState(appliedKeyword);
  const [isPending, startTransition] = useTransition();

  const navigate = (keyword: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = keyword.trim();

    if (trimmed) {
      params.set("keyword", trimmed);
    } else {
      params.delete("keyword");
    }

    params.delete("page");

    const query = params.toString();

    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(value);
  };

  const clear = () => {
    setValue("");
    navigate("");
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={["relative", className].filter(Boolean).join(" ")}
    >
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>

      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />

      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-32 text-sm text-gray-700 placeholder:text-gray-400 transition-colors focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 [&::-webkit-search-cancel-button]:appearance-none"
      />

      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-[5.25rem] top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
        >
          <XMarkIcon className="size-3" />
        </button>
      )}

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:cursor-wait disabled:opacity-70"
      >
        {isPending && (
          <span
            aria-hidden="true"
            className="size-3 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
        )}
        Search
      </button>
    </form>
  );
};

export default CatalogSearch;
