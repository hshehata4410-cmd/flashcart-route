import { axios, axiosV2 } from "./axios";
import type {
  Order,
  ShippingAddressInput,
} from "@features/orders/types";

const withToken = (token: string) => ({ headers: { token } });

/** Pulls the cart id out of the server-cart payload shapes. */
const readCartId = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as {
    _id?: unknown;
    cartId?: unknown;
    data?: unknown;
  };

  if (typeof root._id === "string" && root._id) return root._id;
  if (typeof root.cartId === "string" && root.cartId) return root.cartId;

  if (root.data && typeof root.data === "object") {
    const data = root.data as { _id?: unknown; cartId?: unknown };

    if (typeof data._id === "string" && data._id) return data._id;
    if (typeof data.cartId === "string" && data.cartId) return data.cartId;
  }

  return null;
};

/** Normalizes the user-orders payloads (`{ data: [...] }` or a bare array). */
const normalizeOrders = (payload: unknown): Order[] => {
  if (Array.isArray(payload)) return payload as Order[];

  if (payload && typeof payload === "object") {
    const root = payload as { data?: unknown };

    if (Array.isArray(root.data)) return root.data as Order[];
  }

  return [];
};

/**
 * Resolves the signed-in user's server cart id (`GET /v2/cart`).
 * Orders are placed against this id.
 */
export const getServerCartId = async (token: string): Promise<string> => {
  const { data } = await axiosV2.get("/cart", withToken(token));

  const cartId = readCartId(data);

  if (!cartId) throw new Error("Unable to find your cart. Please try again.");

  return cartId;
};

/**
 * Places a cash-on-delivery order (`POST /orders/:cartId`).
 */
export const createCashOrder = async (
  token: string,
  cartId: string,
  shippingAddress: ShippingAddressInput,
): Promise<unknown> => {
  const { data } = await axios.post(
    `/orders/${cartId}`,
    { shippingAddress },
    withToken(token),
  );

  return data;
};

/**
 * Starts a Stripe checkout session (`POST /orders/checkout-session/:cartId`).
 * Resolves with the session URL the browser should be redirected to.
 * `redirectUrl` is where the payment gateway sends the user back to.
 */
export const createCheckoutSession = async (
  token: string,
  cartId: string,
  shippingAddress: ShippingAddressInput,
  redirectUrl: string,
): Promise<string> => {
  const { data } = await axios.post(
    `/orders/checkout-session/${cartId}?url=${encodeURIComponent(redirectUrl)}`,
    { shippingAddress },
    withToken(token),
  );

  const url =
    (data as { session?: { url?: unknown } })?.session?.url ??
    (data as { data?: { session?: { url?: unknown } } })?.data?.session?.url ??
    (data as { data?: { url?: unknown } })?.data?.url;

  if (typeof url !== "string" || !url) {
    throw new Error("Unable to start the payment session. Please try again.");
  }

  return url;
};

/** Lists the signed-in user's orders (`GET /orders/user/:userId`). */
export const getUserOrders = async (
  token: string,
  userId: string,
): Promise<Order[]> => {
  const { data } = await axios.get(
    `/orders/user/${userId}`,
    withToken(token),
  );

  return normalizeOrders(data);
};
