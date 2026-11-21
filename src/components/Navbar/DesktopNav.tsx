"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ChevronDownIcon from "@svg/ChevronDownIcon";
import { NAV_LINKS } from "./constants";
import type { ActiveLocation } from "./types";
import { isHrefActive } from "./utils";

const navLinkClasses = (active: boolean) =>
  [
    "font-medium transition-colors",
    active ? "text-primary-600" : "text-gray-700 hover:text-primary-600",
  ].join(" ");

type DesktopNavContentProps = {
  /** Current location, or `null` while the nav is still prerendering. */
  location: ActiveLocation | null;
};

/**
 * Presentational nav, kept free of navigation hooks so it can also render as
 * the Suspense fallback while the active route is resolved.
 */
export const DesktopNavContent = ({ location }: DesktopNavContentProps) => {
  const isActive = (href: string) =>
    location !== null && isHrefActive(href, location);

  return (
    <nav className="hidden lg:flex items-center gap-6">
      {NAV_LINKS.map((item) => {
        if ("links" in item) {
          // A parent item is active when any of its nested items is.
          const groupActive = item.links.some((link) => isActive(link.href));

          return (
            <div key={item.label} className="relative group">
              <button
                type="button"
                className={`flex items-center gap-1.5 py-2 ${navLinkClasses(
                  groupActive,
                )}`}
              >
                {item.label}
                <ChevronDownIcon className="size-2.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 min-w-[200px]">
                  {item.links.map((link) => {
                    const active = isActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "block px-4 py-2.5 transition-colors",
                          active
                            ? "bg-primary-50 text-primary-600 font-medium"
                            : "text-gray-600 hover:text-primary-600 hover:bg-primary-50",
                        ].join(" ")}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={navLinkClasses(isActive(item.href))}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

const DesktopNav = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return <DesktopNavContent location={{ pathname, searchParams }} />;
};

export default DesktopNav;
