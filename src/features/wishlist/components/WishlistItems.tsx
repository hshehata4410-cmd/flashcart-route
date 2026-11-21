"use client";

import { useEffect, useRef, useState } from "react";
import { getProduct } from "@api/products";
import type { Product } from "@features/products/types";
import { useProductsStore } from "../../../store/useProductsStore";
import EmptyState from "@features/products/components/EmptyState";
import WishlistItem from "./WishlistItem";

const WishlistItems = () => {
  const favoriteIds = useProductsStore((state) => state.favorites);

  const [products, setProducts] = useState<Record<string, Product>>({});
  const attemptedIds = useRef(new Set<string>());

  useEffect(() => {
    const missing = favoriteIds.filter(
      (id) => !products[id] && !attemptedIds.current.has(id)
    );

    if (missing.length === 0) return;

    let active = true;

    Promise.all(
      missing.map(async (id) => {
        try {
          return [id, await getProduct(id)] as const;
        } catch {
          return null;
        }
      })
    ).then((entries) => {
      missing.forEach((id) => attemptedIds.current.add(id));

      if (!active) return;

      const fetched = entries.filter(
        (entry): entry is readonly [string, Product] => entry !== null
      );

      if (fetched.length === 0) return;

      setProducts((current) => {
        const next = { ...current };

        for (const [id, product] of fetched) {
          next[id] = product;
        }

        return next;
      });
    });

    return () => {
      active = false;
    };
  }, [favoriteIds, products]);

  if (favoriteIds.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart on a product to save it here for later."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {favoriteIds.map((id) => {
        const product = products[id];

        if (!product) {
          return (
            <div
              key={id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="aspect-square animate-pulse bg-gray-100" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />
                <div className="h-9 w-full animate-pulse rounded-full bg-gray-100" />
              </div>
            </div>
          );
        }

        return <WishlistItem key={id} product={product} />;
      })}
    </div>
  );
};

export default WishlistItems;
