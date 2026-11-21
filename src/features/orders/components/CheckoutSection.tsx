"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@components/ui/Button";
import TextField from "@components/TextField";
import EmptyState from "@features/products/components/EmptyState";
import { getProduct } from "@api/products";
import {
  createCashOrder,
  createCheckoutSession,
  getServerCartId,
} from "@api/orders";
import { getApiErrorMessage } from "@api/axios";
import { readAuthToken } from "@features/auth/utils/session";
import type { Address } from "@features/profile/types";
import type { Product } from "@features/products/types";
import {
  formatPrice,
  getEffectivePrice,
} from "@features/products/utils/format";
import { useProductsStore } from "../../../store/useProductsStore";
import type { ShippingAddressInput } from "../types";

type PaymentMethod = "cash" | "card";

const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please sign in again.";

/**
 * Checkout: pick a saved address (or enter a new one), choose cash or card,
 * then place the order against the server cart id.
 */
const CheckoutSection = ({
  initialAddresses,
}: {
  initialAddresses: Address[];
}) => {
  const cart = useProductsStore((state) => state.cart);
  const clearCart = useProductsStore((state) => state.clearCart);

  const [products, setProducts] = useState<Record<string, Product>>({});
  const attemptedIds = useRef(new Set<string>());

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    initialAddresses[0]?._id ?? "new",
  );
  const [details, setDetails] = useState(initialAddresses[0]?.details ?? "");
  const [phone, setPhone] = useState(initialAddresses[0]?.phone ?? "");
  const [city, setCity] = useState(initialAddresses[0]?.city ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const [fieldErrors, setFieldErrors] = useState<
    Partial<ShippingAddressInput>
  >({});
  const [placing, setPlacing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState(false);

  useEffect(() => {
    const missing = cart
      .map((item) => item.id)
      .filter((id) => !products[id] && !attemptedIds.current.has(id));

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
        for (const [id, product] of fetched) next[id] = product;
        return next;
      });
    });

    return () => {
      active = false;
    };
  }, [cart, products]);

  const subtotal = useMemo(
    () =>
      cart.reduce((total, item) => {
        const product = products[item.id];
        if (!product) return total;
        return total + getEffectivePrice(product) * item.quantity;
      }, 0),
    [cart, products],
  );
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const hasPendingProducts = cart.some((item) => !products[item.id]);

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <p className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-50 text-xl text-green-600">
          ✓
        </p>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Order placed successfully
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Pay cash when your order arrives. You can track it under profile.
        </p>
        <Link
          href="/profile?tab=orders"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700"
        >
          View my orders
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add products to your cart before checking out."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  const selectSavedAddress = (address: Address) => {
    setSelectedAddressId(address._id);
    setDetails(address.details);
    setPhone(address.phone);
    setCity(address.city);
    setFieldErrors({});
  };

  const handlePlaceOrder = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (placing) return;

    const nextErrors: Partial<ShippingAddressInput> = {};
    if (!details.trim()) nextErrors.details = "Address details are required";
    if (!phone.trim()) nextErrors.phone = "Phone number is required";
    if (!city.trim()) nextErrors.city = "City is required";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPlacing(true);
    setSubmitError(null);

    try {
      const token = readAuthToken();
      if (!token) throw new Error(SESSION_EXPIRED_MESSAGE);

      const cartId = await getServerCartId(token);
      const shippingAddress: ShippingAddressInput = {
        details: details.trim(),
        phone: phone.trim(),
        city: city.trim(),
      };

      if (paymentMethod === "cash") {
        await createCashOrder(token, cartId, shippingAddress);
        clearCart();
        setPlacedOrder(true);
      } else {
        const sessionUrl = await createCheckoutSession(
          token,
          cartId,
          shippingAddress,
          // After paying, Stripe sends the user back to the orders tab.
          `${window.location.origin}/profile?tab=orders`,
        );
        window.location.href = sessionUrl;
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message === SESSION_EXPIRED_MESSAGE
          ? SESSION_EXPIRED_MESSAGE
          : getApiErrorMessage(error, "Unable to place your order."),
      );
    } finally {
      setPlacing(false);
    }
  };

  const selectedIsNew = selectedAddressId === "new";

  return (
    <form
      onSubmit={handlePlaceOrder}
      className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
    >
      <div className="grid gap-6">
        <section
          aria-labelledby="checkout-address-heading"
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h2
            id="checkout-address-heading"
            className="text-base font-semibold text-gray-900"
          >
            Shipping address
          </h2>

          {initialAddresses.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {initialAddresses.map((address) => {
                const selected = address._id === selectedAddressId;
                return (
                  <button
                    key={address._id}
                    type="button"
                    onClick={() => selectSavedAddress(address)}
                    aria-pressed={selected}
                    className={[
                      "rounded-xl border p-3 text-left text-sm transition-colors",
                      selected
                        ? "border-primary-600 bg-primary-50/50"
                        : "border-gray-200 hover:border-gray-300",
                    ].join(" ")}
                  >
                    <span className="font-semibold text-gray-900">
                      {address.name}
                    </span>
                    <span className="mt-0.5 block truncate text-gray-500">
                      {address.details}, {address.city}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setSelectedAddressId("new");
                  setDetails("");
                  setPhone("");
                  setCity("");
                  setFieldErrors({});
                }}
                aria-pressed={selectedIsNew}
                className={[
                  "rounded-xl border border-dashed p-3 text-left text-sm transition-colors",
                  selectedIsNew
                    ? "border-primary-600 bg-primary-50/50 text-gray-900"
                    : "border-gray-200 text-gray-500 hover:border-gray-300",
                ].join(" ")}
              >
                + Use a new address
              </button>
            </div>
          )}

          <div className="mt-4 grid gap-4">
            <TextField
              label="Address details"
              name="details"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Street, building, apartment…"
              required
              error={fieldErrors.details}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Phone"
                name="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="01xxxxxxxxx"
                required
                error={fieldErrors.phone}
              />
              <TextField
                label="City"
                name="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Cairo"
                required
                error={fieldErrors.city}
              />
            </div>
          </div>
        </section>

        <section
          aria-labelledby="checkout-payment-heading"
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h2
            id="checkout-payment-heading"
            className="text-base font-semibold text-gray-900"
          >
            Payment method
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2" role="radiogroup">
            {(
              [
                { id: "cash", label: "Cash on delivery", hint: "Pay on arrival" },
                { id: "card", label: "Pay online", hint: "Card via Stripe" },
              ] as { id: PaymentMethod; label: string; hint: string }[]
            ).map((option) => {
              const selected = paymentMethod === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPaymentMethod(option.id)}
                  className={[
                    "rounded-xl border p-3 text-left transition-colors",
                    selected
                      ? "border-primary-600 bg-primary-50/50"
                      : "border-gray-200 hover:border-gray-300",
                  ].join(" ")}
                >
                  <span className="text-sm font-semibold text-gray-900">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {submitError && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}{" "}
            {submitError === SESSION_EXPIRED_MESSAGE && (
              <Link href="/login" className="font-semibold underline">
                Sign in
              </Link>
            )}
          </p>
        )}
      </div>

      <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Order summary</h2>

        <ul className="mt-4 space-y-3">
          {cart.map((item) => {
            const product = products[item.id];
            return (
              <li key={item.id} className="flex items-center gap-3">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  {product ? (
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="block size-full animate-pulse bg-gray-100" />
                  )}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-gray-600">
                  {product?.title ?? "Loading…"} × {item.quantity}
                </span>
                <span className="shrink-0 text-sm font-semibold text-gray-900">
                  {product
                    ? formatPrice(getEffectivePrice(product) * item.quantity)
                    : "—"}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900">
            <span>Total</span>
            <span className="text-primary-600">
              {hasPendingProducts ? "—" : formatPrice(subtotal)}
            </span>
          </div>
        </div>

        <Button type="submit" disabled={placing} className="mt-5 w-full">
          {placing
            ? "Placing order…"
            : paymentMethod === "cash"
              ? "Place order"
              : "Continue to payment"}
        </Button>
      </aside>
    </form>
  );
};

export default CheckoutSection;
