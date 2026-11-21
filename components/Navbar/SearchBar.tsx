"use client";

import { useState, type FormEvent } from "react";

type SearchBarProps = {
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
};

/**
 * Search form for the navbar, used inline on desktop and inside the
 * mobile menu. Owns its input state and hands the trimmed query to the caller.
 */
const SearchBar = ({
  onSearch,
  className,
  placeholder = "Search for products, brands and more...",
  autoFocus,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={["w-full", className].filter(Boolean).join(" ")}
    >
      <div className="relative w-full">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search"
          className="w-full px-5 py-3 pr-12 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm truncate"
        />
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
