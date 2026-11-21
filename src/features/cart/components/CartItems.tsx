"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import IconButton from "@components/ui/IconButton";
import XMarkIcon from "@svg/XMarkIcon";
import { getProduct } from "@api/products";
import type { Product } from "@features/products/types";
import { formatPrice, getEffectivePrice } from "@features/products/utils/format";
import { useProductsStore } from "../../../store/useProductsStore";
import EmptyState from "@features/products/components/EmptyState";

const CartItems = () => {
  const cart = useProductsStore((state) => state.cart);
  const removeFromCart = useProductsStore((state) => state.removeFromCart);
  const incrementCartItem = useProductsStore(
    (state) => state.incrementCartItem,
  );
  const decrementCartItem = useProductsStore(
    (state) => state.decrementCartItem,
  );

  const [products, setProducts] = useState<Record<string, Product>>({});
  const [pending, setPending] = useState<{
    id: string;
    action: "increment" | "decrement" | "remove";
  } | null>(null);
  const attemptedIds = useRef(new Set<string>());

  const runItemAction = async (
    id: string,
    action: "increment" | "decrement" | "remove",
    task: () => Promise<void>,
  ) => {
    if (pending) return;

    setPending({ id, action });

    try {
      await task();
    } finally {
      setPending(null);
    }
  };

  useEffect(() => {
    const missing = cart
      .map((item) => item.id)
      .filter(
        (id) => !products[id] && !attemptedIds.current.has(id),
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
      }),
    ).then((entries) => {
      missing.forEach((id) => attemptedIds.current.add(id));

      if (!active) return;

      const fetched = entries.filter(
        (entry): entry is readonly [string, Product] => entry !== null,
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
  }, [cart, products]);

  if (cart.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse the shop and add products to your cart."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const hasPendingProducts = cart.some((item) => !products[item.id]);

  const subtotal = cart.reduce((total, item) => {
    const product = products[item.id];

    if (!product) return total;

    return total + getEffectivePrice(product) * item.quantity;
  }, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white px-5 shadow-sm">
        {cart.map((item) => {
          const product = products[item.id];

          if (!product) {
            return (
              <div key={item.id} className="flex gap-4 py-5">
                <div className="size-24 shrink-0 animate-pulse rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-8 w-24 animate-pulse rounded-full bg-gray-100" />
                </div>
              </div>
            );
          }

          const unitPrice = getEffectivePrice(product);

          return (
            <div key={item.id} className="flex gap-4 py-5">
              <Link
                href={`/products/${product.id}`}
                className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-gray-50"
              >
                <Image
                  src={product.imageCover}
                  alt={product.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/products/${product.id}`}
                    className="line-clamp-2 text-sm font-semibold text-gray-800 transition-colors hover:text-primary-600"
                  >
                    {product.title}
                  </Link>
                  <IconButton
                    onClick={() =>
                      void runItemAction(item.id, "remove", () =>
                        removeFromCart(item.id),
                      )
                    }
                    aria-label={`Remove ${product.title} from cart`}
                    aria-busy={
                      pending?.id === item.id && pending.action === "remove"
                        ? true
                        : undefined
                    }
                    disabled={pending?.id === item.id}
                    className="shrink-0"
                  >
                    {pending?.id === item.id && pending.action === "remove" ? (
                      <span
                        aria-hidden="true"
                        className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
                      />
                    ) : (
                      <XMarkIcon className="size-4 text-gray-400" />
                    )}
                  </IconButton>
                </div>

                <span className="mt-1 text-sm text-gray-500">
                  {formatPrice(unitPrice)}
                </span>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      aria-busy={
                        pending?.id === item.id && pending.action === "decrement"
                          ? true
                          : undefined
                      }
                      onClick={() =>
                        void runItemAction(item.id, "decrement", () =>
                          decrementCartItem(item.id),
                        )
                      }
                      disabled={pending?.id === item.id}
                      className="flex size-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60"
                    >
                      {pending?.id === item.id &&
                      pending.action === "decrement" ? (
                        <span
                          aria-hidden="true"
                          className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
                        />
                      ) : (
                        "−"
                      )}
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      aria-busy={
                        pending?.id === item.id && pending.action === "increment"
                          ? true
                          : undefined
                      }
                      onClick={() =>
                        void runItemAction(item.id, "increment", () =>
                          incrementCartItem(item.id),
                        )
                      }
                      disabled={pending?.id === item.id}
                      className="flex size-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60"
                    >
                      {pending?.id === item.id &&
                      pending.action === "increment" ? (
                        <span
                          aria-hidden="true"
                          className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
                        />
                      ) : (
                        "+"
                      )}
                    </button>
                  </div>

                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(unitPrice * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          Order summary
        </h2>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>
              {hasPendingProducts ? "—" : formatPrice(subtotal)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-base font-bold text-gray-900">
          <span>Total</span>
          <span className="text-primary-600">
            {hasPendingProducts ? "—" : formatPrice(subtotal)}
          </span>
        </div>

        <Link
          href="/checkout"
          className="mt-5 flex w-full items-center justify-center rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700"
        >
          Proceed to checkout
        </Link>
        <Link
          href="/products"
          className="mt-2 flex w-full items-center justify-center rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
};

export default CartItems;
