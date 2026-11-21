import type { NavItem, NavLink } from "./types";

export const NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  {
    label: "Categories",
    links: [
      { label: "All Categories", href: "/categories" },
      {
        label: "Electronics",
        href: "/products?category=6439d2d167d9aa4ca970649f",
      },
      {
        label: "Women's Fashion",
        href: "/products?category=6439d58a0049ad0b52b9003f",
      },
      {
        label: "Men's Fashion",
        href: "/products?category=6439d5b90049ad0b52b90048",
      },
      {
        label: "Beauty & Health",
        href: "/products?category=6439d30b67d9aa4ca97064b1",
      },
    ],
  },
  { label: "Brands", href: "/brands" },
];

/**
 * Flattened list for the mobile drawer, which has no nested menu: a group
 * collapses to its own label pointing at its first link.
 */
export const MOBILE_NAV_LINKS: NavLink[] = NAV_LINKS.map((item) =>
  "links" in item ? { label: item.label, href: item.links[0].href } : item,
);
