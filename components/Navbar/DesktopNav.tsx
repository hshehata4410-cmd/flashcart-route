"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./constants";

const linkClasses = (active: boolean) =>
  [
    "font-medium transition-colors",
    active ? "text-primary-600" : "text-gray-700 hover:text-primary-600",
  ].join(" ");

/**
 * Desktop nav links with active-state highlighting.
 * Client component because it reads the current pathname via `usePathname`.
 */
const DesktopNav = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={["hidden lg:flex items-center gap-6", className]
        .filter(Boolean)
        .join(" ")}
    >
      {NAV_LINKS.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href ||
              pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href + link.label}
            href={link.href}
            aria-current={active ? "page" : undefined}
            prefetch={false}
            className={linkClasses(active)}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default DesktopNav;
