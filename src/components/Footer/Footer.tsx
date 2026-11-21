import Link from "next/link";
import Container from "@components/ui/Container";

const Footer = () => {
  return (
    <footer className="bg-[#03230f]">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold text-white">
              Flash<span className="text-primary-400">Cart</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-300">
              A modern e-commerce platform for buying and selling products
              online.
            </p>
          </div>

          <nav aria-label="Shop">
            <h2 className="text-sm font-semibold text-white">Shop</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  href="/products"
                  className="transition-colors hover:text-primary-300"
                >
                  All products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="transition-colors hover:text-primary-300"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="transition-colors hover:text-primary-300"
                >
                  Brands
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Account">
            <h2 className="text-sm font-semibold text-white">Account</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  href="/cart"
                  className="transition-colors hover:text-primary-300"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="transition-colors hover:text-primary-300"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="transition-colors hover:text-primary-300"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Support">
            <h2 className="text-sm font-semibold text-white">Support</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li>
                <a
                  href="tel:+18001234567"
                  className="transition-colors hover:text-primary-300"
                >
                  +1 (800) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@freshcart.com"
                  className="transition-colors hover:text-primary-300"
                >
                  support@freshcart.com
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-gray-400 sm:flex-row">
          <span>© 2026 FlashCart. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="transition-colors hover:text-primary-300"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="transition-colors hover:text-primary-300"
            >
              Cart
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
