"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@features/products/types";
import { formatPrice, getEffectivePrice } from "@features/products/utils/format";
import { useProductsStore } from "../../../store/useProductsStore";

/**
 * One saved-wishlist row. Owns its remove control: while the
 * `DELETE /wishlist/:id` request is in flight the button shows a spinner
 * and is disabled.
 */
const WishlistItem = ({ product }: { product: Product }) => {
  const removeFavorite = useProductsStore((state) => state.removeFavorite);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (removing) return;

    setRemoving(true);

    try {
      await removeFavorite(product.id);
    } finally {
      setRemoving(false);
    }
  };

  const price = getEffectivePrice(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-gray-50"
      >
        <Image
          src={product.imageCover}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-sm font-semibold leading-5 text-gray-800 transition-colors hover:text-primary-600"
        >
          {product.title}
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(price)}
          </span>
          {price < product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => void handleRemove()}
          disabled={removing}
          aria-busy={removing || undefined}
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-wait disabled:opacity-70"
        >
          {removing ? (
            <>
              <span
                aria-hidden="true"
                className="size-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-600"
              />
              Removing…
            </>
          ) : (
            "Remove"
          )}
        </button>
      </div>
    </article>
  );
};

export default WishlistItem;
