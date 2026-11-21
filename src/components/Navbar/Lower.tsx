"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchIcon from "@svg/SearchIcon";
import HeadsetIcon from "@svg/HeadsetIcon";
import HeartIcon from "@svg/HeartIcon";
import CartIcon from "@svg/CartIcon";
import UserIcon from "@svg/UserIcon";
import BarsIcon from "@svg/BarsIcon";
import Container from "@components/ui/Container";
import CountBadge from "@components/ui/CountBadge";
import Modal from "@components/ui/Modal";
import { useAuth } from "@features/auth/utils/useAuth";
import { useProductsStore } from "../../store/useProductsStore";
import DesktopNav, { DesktopNavContent } from "./DesktopNav";
import MobileDrawer from "./MobileDrawer";
import SearchBar from "./SearchBar";

const Lower = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const favoritesCount = useProductsStore((state) => state.favorites.length);
  const cartCount = useProductsStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0),
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (query: string) => {
    setIsSearchOpen(false);
    router.push(
      query ? `/products?search=${encodeURIComponent(query)}` : "/products",
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <Container>
          <div className="flex items-center justify-between h-16 lg:h-[72px] gap-4 lg:gap-8">
            <Link className="shrink-0" href="/">
              <Image
                src="/freshcart-logo.svg"
                alt="FreshCart"
                width={160}
                height={31}
                preload
                className="h-6 lg:h-8 w-auto"
              />
            </Link>

            <SearchBar
              onSubmit={handleSearch}
              className="hidden lg:flex flex-1 max-w-2xl"
            />

            {/* Reading search params needs a Suspense boundary on prerendered routes. */}
            <Suspense fallback={<DesktopNavContent location={null} />}>
              <DesktopNav />
            </Suspense>

            <div className="flex items-center gap-1 lg:gap-2">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
              >
                <SearchIcon className="size-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
              </button>

              <Link
                href="/contact"
                className="hidden xl:flex items-center gap-2 pr-3 mr-2 border-r border-gray-200 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                  <HeadsetIcon className="size-4 text-primary-600" />
                </div>
                <div className="text-xs">
                  <div className="text-gray-400">Support</div>
                  <div className="font-semibold text-gray-700">24/7 Help</div>
                </div>
              </Link>

              <Link
                href="/wishlist"
                title="Wishlist"
                aria-label={`Wishlist (${favoritesCount})`}
                className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
              >
                <HeartIcon className="size-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                <CountBadge
                  count={favoritesCount}
                  className="absolute -right-0.5 -top-0.5"
                />
              </Link>
              <Link
                href="/cart"
                title="Cart"
                aria-label={`Cart (${cartCount})`}
                className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
              >
                <CartIcon className="size-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                <CountBadge
                  count={cartCount}
                  className="absolute -right-0.5 -top-0.5"
                />
              </Link>

              <Link
                href={isAuthenticated ? "/profile" : "/login"}
                className="hidden lg:flex items-center gap-2 ml-2 px-5 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-primary-600/20"
              >
                <UserIcon className="size-3" />
                {isAuthenticated ? "Profile" : "Sign In"}
              </Link>

              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden ml-1 w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-colors"
              >
                <BarsIcon className="size-4" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      <Modal
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search"
      >
        <SearchBar onSubmit={handleSearch} autoFocus />
      </Modal>

      <MobileDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Lower;
