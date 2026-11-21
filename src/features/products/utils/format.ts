import type { Product } from "../types";

export const formatPrice = (value: number) =>
  `${value.toLocaleString("en-US")} EGP`;

/** The price a customer actually pays, honoring a discount when present. */
export const getEffectivePrice = (product: Product) =>
  typeof product.priceAfterDiscount === "number" &&
  product.priceAfterDiscount < product.price
    ? product.priceAfterDiscount
    : product.price;
