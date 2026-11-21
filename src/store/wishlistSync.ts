import {
  addServerWishlistItem,
  getServerWishlist,
} from "@api/wishlist";
import { readAuthToken } from "@features/auth/utils/session";
import { useProductsStore } from "./useProductsStore";

/**
 * Merges the guest (localStorage) wishlist into the signed-in user's server
 * wishlist. Runs once per sign-in: missing ids are pushed server-side, then
 * the local list is replaced with the fresh server wishlist. Returns false
 * (keeping the local list intact) when there is no session or the server
 * can't be reached.
 */
export const syncLocalWishlistToServer = async (): Promise<boolean> => {
  const token = readAuthToken();
  if (!token) return false;

  const localFavorites = useProductsStore.getState().favorites;

  try {
    if (localFavorites.length > 0) {
      const serverIds = new Set(await getServerWishlist(token));

      for (const id of localFavorites) {
        if (!serverIds.has(id)) {
          await addServerWishlistItem(token, id);
          serverIds.add(id);
        }
      }
    }

    useProductsStore.getState().replaceFavorites(await getServerWishlist(token));

    return true;
  } catch {
    return false;
  }
};
