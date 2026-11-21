import { axios } from "./axios";

const withToken = (token: string) => ({ headers: { token } });

type ServerWishlistEntry = string | { _id?: string; id?: string } | null;

type ServerWishlistPayload = {
  data?: unknown;
  wishlist?: unknown;
};

/**
 * Normalizes the logged-in user's server wishlist (`GET /wishlist`) to a
 * plain id list. The API answers with full product objects; plain ids are
 * accepted too so the shape stays robust.
 */
const normalizeServerWishlist = (payload: unknown): string[] => {
  let list: unknown = payload;

  if (payload !== null && typeof payload === "object") {
    const envelope = payload as ServerWishlistPayload;

    if (Array.isArray(envelope.data)) {
      list = envelope.data;
    } else if (
      envelope.data !== null &&
      typeof envelope.data === "object" &&
      Array.isArray((envelope.data as { wishlist?: unknown }).wishlist)
    ) {
      list = (envelope.data as { wishlist: unknown[] }).wishlist;
    }
  }

  if (!Array.isArray(list)) return [];

  const ids = new Set<string>();

  for (const entry of list as ServerWishlistEntry[]) {
    const id =
      typeof entry === "string"
        ? entry
        : (entry?._id ?? entry?.id);

    if (id) ids.add(id);
  }

  return [...ids];
};

/** Fetches the logged-in user's server wishlist (`GET /wishlist`). */
export const getServerWishlist = async (token: string): Promise<string[]> => {
  const { data } = await axios.get("/wishlist", withToken(token));

  return normalizeServerWishlist(data);
};

/** Adds a product to the server wishlist (`POST /wishlist`). */
export const addServerWishlistItem = async (
  token: string,
  productId: string,
): Promise<void> => {
  await axios.post("/wishlist", { productId }, withToken(token));
};

/** Removes a product from the server wishlist (`DELETE /wishlist/:id`). */
export const removeServerWishlistItem = async (
  token: string,
  productId: string,
): Promise<void> => {
  await axios.delete(`/wishlist/${productId}`, withToken(token));
};
