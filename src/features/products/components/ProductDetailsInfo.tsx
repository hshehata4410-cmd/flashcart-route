"use client";

import { useState } from "react";
import Button from "@components/ui/Button";
import IconButton from "@components/ui/IconButton";
import HeartIcon from "@svg/HeartIcon";
import StarIcon from "@svg/StarIcon";
import type { Product } from "../types";
import { formatPrice, getEffectivePrice } from "../utils/format";
import { useProductsStore } from "../../../store/useProductsStore";

type CartAction = "add" | "increment" | "decrement" | "remove";

const GraySpinner = () => (
  <span
    aria-hidden="true"
    className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
  />
);

const ProductDetailsInfo = ({ product }: { product: Product }) => {
  const cartQuantity = useProductsStore(
    (state) => state.cart.find((item) => item.id === product.id)?.quantity ?? 0,
  );
  const favorite = useProductsStore((state) =>
    state.favorites.includes(product.id),
  );

  const addToCart = useProductsStore((state) => state.addToCart);
  const removeFromCart = useProductsStore((state) => state.removeFromCart);
  const incrementCartItem = useProductsStore(
    (state) => state.incrementCartItem,
  );
  const decrementCartItem = useProductsStore(
    (state) => state.decrementCartItem,
  );
  const toggleFavorite = useProductsStore((state) => state.toggleFavorite);

  const [pendingAction, setPendingAction] = useState<CartAction | "favorite" | null>(null);
  const busy = pendingAction !== null;

  const runCartAction = async (action: CartAction | "favorite", task: () => Promise<void>) => {
    if (pendingAction) return;

    setPendingAction(action);

    try {
      await task();
    } finally {
      setPendingAction(null);
    }
  };

  const currentPrice = getEffectivePrice(product);
  const hasDiscount = currentPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - currentPrice) / product.price) * 100)
    : 0;

  const outOfStock = product.quantity <= 0;
  /** Exact counts only show when stock is low, to nudge without noise. */
  const LOW_STOCK_THRESHOLD = 5;
  const lowStock = !outOfStock && product.quantity <= LOW_STOCK_THRESHOLD;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 text-xs">
        {product.brand?.name && (
          <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-600">
            {product.brand.name}
          </span>
        )}
        {product.category?.name && (
          <span className="rounded-full bg-primary-50 px-3 py-1 font-semibold text-primary-700">
            {product.category.name}
          </span>
        )}
      </div>

      <h1 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
        {product.title}
      </h1>

      <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
        <StarIcon className="size-4 text-amber-400" />
        <span className="font-semibold text-gray-700">
          {product.ratingsAverage.toFixed(1)}
        </span>
        <span>({product.ratingsQuantity} reviews)</span>
        <span aria-hidden="true">·</span>
        <span>{product.sold} sold</span>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary-600">
          {formatPrice(currentPrice)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-base text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {product.description}
      </p>

      <p className="mt-3 text-sm">
        {outOfStock ? (
          <span className="font-semibold text-red-500">Out of stock</span>
        ) : lowStock ? (
          <span className="font-semibold text-green-600">
            In stock ({product.quantity} available)
          </span>
        ) : (
          <span className="font-semibold text-green-600">In stock</span>
        )}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {cartQuantity === 0 ? (
          <Button
            type="button"
            onClick={() =>
              void runCartAction("add", () => addToCart(product.id))
            }
            disabled={outOfStock || busy}
            aria-busy={pendingAction === "add" || undefined}
            className="min-w-44"
          >
            {pendingAction === "add" ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                />
                Adding…
              </>
            ) : (
              "Add to cart"
            )}
          </Button>
        ) : (
          <>
            <div className="flex items-center rounded-full border border-gray-200">
              <button
                type="button"
                aria-label="Decrease quantity"
                aria-busy={pendingAction === "decrement" || undefined}
                onClick={() =>
                  void runCartAction("decrement", () =>
                    decrementCartItem(product.id),
                  )
                }
                disabled={busy}
                className="flex size-10 items-center justify-center rounded-full text-lg text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60"
              >
                {pendingAction === "decrement" ? <GraySpinner /> : "−"}
              </button>
              <span
                aria-live="polite"
                className="w-10 text-center text-sm font-bold text-gray-900"
              >
                {cartQuantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                aria-busy={pendingAction === "increment" || undefined}
                onClick={() =>
                  void runCartAction("increment", () =>
                    incrementCartItem(product.id),
                  )
                }
                disabled={busy}
                className="flex size-10 items-center justify-center rounded-full text-lg text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60"
              >
                {pendingAction === "increment" ? <GraySpinner /> : "+"}
              </button>
            </div>

            <span className="text-sm font-bold text-gray-900">
              {formatPrice(currentPrice * cartQuantity)}
            </span>

            <button
              type="button"
              onClick={() =>
                void runCartAction("remove", () =>
                  removeFromCart(product.id),
                )
              }
              disabled={busy}
              aria-busy={pendingAction === "remove" || undefined}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
            >
              {pendingAction === "remove" ? (
                <>
                  <GraySpinner />
                  Removing…
                </>
              ) : (
                "Remove from Cart"
              )}
            </button>
          </>
        )}

        <IconButton
          onClick={() =>
            void runCartAction("favorite", () => toggleFavorite(product.id))
          }
          aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={favorite}
          aria-busy={pendingAction === "favorite" || undefined}
          disabled={busy}
        >
          {pendingAction === "favorite" ? (
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
      </div>
    </div>
  );
};

export default ProductDetailsInfo;
