export type NavLink = {
  label: string;
  href: string;
};

export type NavGroup = {
  label: string;
  links: NavLink[];
};

/** A nav entry is either a plain link or a link that opens a nested list. */
export type NavItem = NavLink | NavGroup;

/** Minimal shape of a URL's query string (`URLSearchParams` satisfies it). */
export type SearchParamsLike = {
  get(name: string): string | null;
  keys(): Iterable<string>;
};

export type ActiveLocation = {
  pathname: string;
  searchParams: SearchParamsLike;
};
