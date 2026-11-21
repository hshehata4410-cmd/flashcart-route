"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import IconButton from "@components/ui/IconButton";
import CartIcon from "@svg/CartIcon";
import HeartIcon from "@svg/HeartIcon";
import StarIcon from "@svg/StarIcon";
import type { Product } from "../types";
import { formatPrice, getEffectivePrice } from "../utils/format";
import { useProductsStore } from "../../../store/useProductsStore";

const ProductCard = ({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) => {
  const favorite = useProductsStore((state) =>
    state.favorites.includes(product.id)
  );

  const cartQuantity = useProductsStore(
    (state) => state.cart.find((item) => item.id === product.id)?.quantity ?? 0
  );

  const toggleFavorite = useProductsStore((state) => state.toggleFavorite);
  const addToCart = useProductsStore((state) => state.addToCart);
  const removeFromCart = useProductsStore((state) => state.removeFromCart);
  const [cartPending, setCartPending] = useState(false);
  const [favoritePending, setFavoritePending] = useState(false);

  const handleCartAction = async () => {
    if (cartPending) return;

    setCartPending(true);

    try {
      if (cartQuantity > 0) {
        await removeFromCart(product.id);
      } else {
        await addToCart(product.id);
      }
    } finally {
      setCartPending(false);
    }
  };

  const handleFavoriteAction = async () => {
    if (favoritePending) return;

    setFavoritePending(true);

    try {
      await toggleFavorite(product.id);
    } finally {
      setFavoritePending(false);
    }
  };

  const currentPrice = getEffectivePrice(product);
  const hasDiscount = currentPrice < product.price;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - currentPrice) / product.price) * 100)
    : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          loading={priority ? "eager" : "lazy"}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            -{discountPercent}%
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <IconButton
            onClick={() => void handleFavoriteAction()}
            aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={favorite}
            aria-busy={favoritePending || undefined}
            disabled={favoritePending}
          >
            {favoritePending ? (
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
              />
            ) : (
              <HeartIcon
                className={`size-4 transition-colors ${
                  favorite ? "text-red-500" : "text-gray-400"
                }`}
              />
            )}
          </IconButton>

          <IconButton
            onClick={() => void handleCartAction()}
            aria-label={cartQuantity > 0 ? "Remove from cart" : "Add to cart"}
            aria-pressed={cartQuantity > 0}
            aria-busy={cartPending || undefined}
            disabled={cartPending}
          >
            {cartPending ? (
              <span
                aria-hidden="true"
                className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
              />
            ) : (
              <CartIcon
                className={`size-4 transition-colors ${
                  cartQuantity > 0 ? "text-primary-600" : "text-gray-400"
                }`}
              />
            )}
          </IconButton>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <StarIcon className="size-3.5 text-amber-400" />
          <span className="font-semibold text-gray-700">
            {product.ratingsAverage.toFixed(1)}
          </span>
          <span>({product.ratingsQuantity})</span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-gray-800">
          {product.title}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4">
          <Link
            href={`/products/${product.id}`}
            className="flex w-full items-center justify-center rounded-full border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:border-primary-600 hover:text-primary-600"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
