import Link from "next/link";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";

/**
 * FlashCart navbar: logo, search input, and links.
 * Server component — interactive parts (search, active links, mobile menu)
 * live in the client components it renders.
 */
const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16 lg:h-[72px] gap-4 lg:gap-8">
          {/* Logo */}
          <Link href="/" prefetch={false} className="shrink-0 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />
              </svg>
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-gray-900">Flash</span>
              <span className="text-primary-600">Cart</span>
            </span>
          </Link>

          {/* Search (desktop) */}
          <SearchBar className="hidden lg:flex flex-1 max-w-2xl" />

          {/* Links (desktop) */}
          <DesktopNav />

          {/* Mobile menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
