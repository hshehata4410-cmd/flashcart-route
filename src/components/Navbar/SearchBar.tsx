"use client";

import { useState, type FormEvent } from "react";
import SearchIcon from "@svg/SearchIcon";

type SearchBarProps = {
  /** Called with the trimmed query when the form is submitted. */
  onSubmit: (query: string) => void;
  /** Wrapper classes, e.g. responsive visibility or width. */
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
};

/**
 * Search form for the navbar, used inline on desktop and inside the mobile
 * search modal. Owns its input state and hands the query to the caller.
 */
const SearchBar = ({
  onSubmit,
  className,
  placeholder = "Search for products, brands and more...",
  autoFocus,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={["w-full", className].filter(Boolean).join(" ")}
    >
      <div className="relative w-full">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full px-5 py-3 pr-12 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm truncate"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
        >
          <SearchIcon className="size-4" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
