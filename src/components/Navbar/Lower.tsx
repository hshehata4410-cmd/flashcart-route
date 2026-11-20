"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchIcon from "@/src/svg/SearchIcon";
import ChevronDownIcon from "@/src/svg/ChevronDownIcon";
import HeadsetIcon from "@/src/svg/HeadsetIcon";
import HeartIcon from "@/src/svg/HeartIcon";
import CartIcon from "@/src/svg/CartIcon";
import UserIcon from "@/src/svg/UserIcon";
import BarsIcon from "@/src/svg/BarsIcon";
import MobileDrawer from "./MobileDrawer";

const categories = [
  { label: "All Categories", href: "/categories" },
  {
    label: "Electronics",
    href: "/products?category=6439d58a0049ad0b52b9003f",
  },
  {
    label: "Women's Fashion",
    href: "/products?category=6439d5b90049ad0b52b90048",
  },
  {
    label: "Men's Fashion",
    href: "/products?category=6439d2d167d9aa4ca970649f",
  },
  {
    label: "Beauty & Health",
    href: "/products?category=6439d40367d9aa4ca97064a8",
  },
];

const Lower = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4">
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

            <form className="hidden lg:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="w-full px-5 py-3 pr-12 rounded-full border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <SearchIcon className="size-4" />
                </button>
              </div>
            </form>

            <nav className="hidden xl:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Shop
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 font-medium transition-colors py-2">
                  Categories
                  <ChevronDownIcon className="size-2.5 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white border border-gray-100 rounded-xl shadow-xl py-2 min-w-[200px]">
                    {categories.map((category) => (
                      <Link
                        key={category.label}
                        href={category.href}
                        className="block px-4 py-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                href="/brands"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Brands
              </Link>
            </nav>

            <div className="flex items-center gap-1 lg:gap-2">
              <Link
                href="/contact"
                className="hidden lg:flex items-center gap-2 pr-3 mr-2 border-r border-gray-200 hover:opacity-80 transition-opacity"
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
                aria-label="Wishlist"
                className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
              >
                <HeartIcon className="size-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
              </Link>
              <Link
                href="/cart"
                title="Cart"
                aria-label="Cart"
                className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group"
              >
                <CartIcon className="size-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
              </Link>

              <Link
                href="/signin"
                className="hidden lg:flex items-center gap-2 ml-2 px-5 py-2.5 rounded-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-primary-600/20"
              >
                <UserIcon className="size-3" />
                Sign In
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
        </div>
      </header>

      <MobileDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Lower;
