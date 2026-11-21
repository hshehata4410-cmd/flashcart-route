"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@features/products/utils/format";
import { refreshCartFromServer } from "../../../store/cartSync";
import type { Order, OrderItem } from "../types";

const itemProductTitle = (item: OrderItem, fallback: string): string => {
  if (item.product && typeof item.product === "object") {
    return item.product.title ?? fallback;
  }

  return typeof item.product === "string" && item.product
    ? `Product ${item.product.slice(-6)}`
    : fallback;
};

const itemCount = (item: OrderItem): number =>
  typeof item.count === "number" && item.count > 0
    ? item.count
    : typeof item.quantity === "number" && item.quantity > 0
    ? item.quantity
    : 1;

type GroupedItem = {
  key: string;
  title: string;
  count: number;
  /** Summed line total, or null when no entry carries a price. */
  total: number | null;
};

/**
 * Merges repeat entries of the same product into one row so an order never
 * lists the same item redundantly.
 */
const groupItems = (items: OrderItem[]): GroupedItem[] => {
  const groups = new Map<string, GroupedItem>();

  items.forEach((item, index) => {
    const product = item.product;
    const key =
      typeof product === "string" && product
        ? product
        : typeof product === "object" && product !== null
        ? product._id ?? product.id ?? product.title ?? `item-${index}`
        : `item-${index}`;

    const count = itemCount(item);
    const lineTotal =
      typeof item.price === "number" ? item.price * count : null;
    const existing = groups.get(key);

    if (existing) {
      existing.count += count;
      existing.total =
        existing.total !== null && lineTotal !== null
          ? existing.total + lineTotal
          : existing.total ?? lineTotal;
    } else {
      groups.set(key, {
        key,
        title: itemProductTitle(item, `Item ${index + 1}`),
        count,
        total: lineTotal,
      });
    }
  });

  return [...groups.values()];
};

const orderTotal = (order: Order): number => {
  if (typeof order.totalOrderPrice === "number") return order.totalOrderPrice;
  if (typeof order.totalPrice === "number") return order.totalPrice;

  return (order.cartItems ?? []).reduce(
    (total, item) =>
      total +
      (typeof item.price === "number" ? item.price : 0) * itemCount(item),
    0
  );
};

const orderDate = (order: Order): string => {
  if (!order.createdAt) return "";

  try {
    return new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const Badge = ({
  tone,
  children,
}: {
  tone: "green" | "amber" | "blue" | "gray";
  children: React.ReactNode;
}) => {
  const tones: Record<string, string> = {
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-primary-50 text-primary-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
};

/** Expandable order card: summary row plus items and shipping details. */
const OrderCard = ({
  order,
  expanded,
  onToggle,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const items = order.cartItems ?? [];
  const grouped = groupItems(items);
  const quantity = grouped.reduce((total, item) => total + item.count, 0);
  const paymentLabel =
    order.paymentMethodType === "card"
      ? "Card"
      : order.paymentMethodType === "cash"
      ? "Cash"
      : order.paymentMethodType ?? "—";

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {[orderDate(order), `${quantity} item${quantity === 1 ? "" : "s"}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-bold text-primary-600">
            {formatPrice(orderTotal(order))}
          </span>
          <span
            aria-hidden="true"
            className={[
              "text-gray-400 transition-transform",
              expanded ? "rotate-180" : "",
            ].join(" ")}
          >
            ▾
          </span>
        </div>
      </button>

      <div className="flex flex-wrap gap-2 border-t border-gray-100 px-5 py-3">
        <Badge tone={order.isPaid ? "green" : "amber"}>
          {order.isPaid ? "Paid" : "Unpaid"}
        </Badge>
        <Badge tone={order.isDelivered ? "green" : "gray"}>
          {order.isDelivered ? "Delivered" : "Processing"}
        </Badge>
        <Badge tone="blue">{paymentLabel}</Badge>
      </div>

      {expanded && (
        <div className="px-5 py-3">
          <ul className="divide-y divide-gray-100 rounded-xl bg-gray-50 px-4">
            {grouped.length === 0 && (
              <li className="py-3 text-sm text-gray-500">
                No item details for this order.
              </li>
            )}
            {grouped.map((item) => (
              <li
                key={item.key}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <span className="min-w-0 truncate text-gray-700">
                  {item.title}
                  <span className="ml-2 text-xs text-gray-400">
                    × {item.count}
                  </span>
                </span>
                <span className="shrink-0 font-semibold text-gray-900">
                  {item.total !== null ? formatPrice(item.total) : "—"}
                </span>
              </li>
            ))}
          </ul>

          {order.shippingAddress && (
            <p className="mt-3 text-xs leading-5 text-gray-500">
              Ship to: {order.shippingAddress.details},{" "}
              {order.shippingAddress.city} · {order.shippingAddress.phone}
            </p>
          )}
        </div>
      )}
    </article>
  );
};

/** Orders tab content: list of expandable orders or an empty state. */
const OrdersList = ({
  orders,
  loadError,
}: {
  orders: Order[];
  loadError?: string | null;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    orders.length === 1 ? orders[0]._id : null
  );

  // The server cart is emptied when an order succeeds, but a Stripe payment
  // leaves the app and back — replace any stale local copy on arrival.
  useEffect(() => {
    void refreshCartFromServer();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
        <p className="text-sm font-semibold text-gray-700">
          {loadError ?? "You have no orders yet."}
        </p>
        <p className="mt-1 text-sm text-gray-400">
          {loadError
            ? "Refresh the page, or sign in again if your session has expired."
            : "Place your first order from the cart."}
        </p>
        <Link
          href={loadError ? "/login" : "/products"}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700"
        >
          {loadError ? "Back to sign in" : "Browse products"}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          expanded={expandedId === order._id}
          onToggle={() =>
            setExpandedId((current) =>
              current === order._id ? null : order._id
            )
          }
        />
      ))}
    </div>
  );
};

export default OrdersList;
