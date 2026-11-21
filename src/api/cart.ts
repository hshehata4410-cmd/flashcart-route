import type { CartItem } from "@features/products/types";
import { axiosV2 } from "./axios";

const withToken = (token: string) => ({ headers: { token } });

type ServerCartProduct = {
  product?: string | { _id?: string; id?: string } | null;
  count?: number;
  quantity?: number;
};

type ServerCartPayload = {
  products?: ServerCartProduct[];
};

/**
 * Normalizes the logged-in user's server cart (`GET /v2/cart`) to the local
 * shape. The API returns `{ data: { products: [...] } }` where each entry
 * carries a `count` and either a populated product object or a plain id.
 */
const normalizeServerCart = (payload: unknown): CartItem[] => {
  const cart = (
    payload !== null &&
    typeof payload === "object" &&
    "data" in payload
      ? (payload as { data?: unknown }).data
      : payload
  ) as ServerCartPayload | null;

  if (!cart || !Array.isArray(cart.products)) return [];

  const items = new Map<string, number>();

  for (const entry of cart.products) {
    if (!entry || typeof entry !== "object") continue;

    const product = entry.product;
    const id =
      typeof product === "string"
        ? product
        : (product?._id ?? product?.id);

    if (!id) continue;

    const quantity =
      typeof entry.count === "number" && entry.count > 0
        ? entry.count
        : typeof entry.quantity === "number" && entry.quantity > 0
          ? entry.quantity
          : 1;

    items.set(id, (items.get(id) ?? 0) + quantity);
  }

  return [...items.entries()].map(([id, quantity]) => ({ id, quantity }));
};

/** Fetches the logged-in user's server cart (`GET /v2/cart`). */
export const getServerCart = async (token: string): Promise<CartItem[]> => {
  const { data } = await axiosV2.get("/cart", withToken(token));

  return normalizeServerCart(data);
};

/** Adds one unit of a product to the server cart (`POST /v2/cart`). */
export const addServerCartItem = async (
  token: string,
  productId: string,
): Promise<void> => {
  await axiosV2.post("/cart", { productId }, withToken(token));
};

/** Sets the quantity of a product already in the server cart (`PUT /v2/cart/:id`). */
export const setServerCartQuantity = async (
  token: string,
  productId: string,
  quantity: number,
): Promise<void> => {
  await axiosV2.put(
    `/cart/${productId}`,
    { count: quantity },
    withToken(token),
  );
};

/** Removes a product from the server cart (`DELETE /v2/cart/:id`). */
export const removeServerCartItem = async (
  token: string,
  productId: string,
): Promise<void> => {
  await axiosV2.delete(`/cart/${productId}`, withToken(token));
};
