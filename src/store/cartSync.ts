import {
  addServerCartItem,
  getServerCart,
  setServerCartQuantity,
} from "@api/cart";
import { readAuthToken } from "@features/auth/utils/session";
import { useProductsStore } from "./useProductsStore";
/**
 * Merges the guest (localStorage) cart into the signed-in user's server cart.
 *
 * Runs once per sign-in: quantities are added on top of what the server
 * already holds, then the local cart is replaced with the fresh server cart
 * so the two stop diverging. Returns false (keeping the local cart intact)
 * when there is no session or the server can't be reached.
 */
export const syncLocalCartToServer = async (): Promise<boolean> => {
  const token = readAuthToken();
  if (!token) return false;

  const localCart = useProductsStore.getState().cart;

  try {
    if (localCart.length > 0) {
      const serverQuantities = new Map(
        (await getServerCart(token)).map((item) => [item.id, item.quantity]),
      );

      for (const item of localCart) {
        const existing = serverQuantities.get(item.id) ?? 0;

        if (existing > 0) {
          await setServerCartQuantity(token, item.id, existing + item.quantity);
        } else {
          await addServerCartItem(token, item.id);

          if (item.quantity > 1) {
            await setServerCartQuantity(token, item.id, item.quantity);
          }
        }

        serverQuantities.set(item.id, existing + item.quantity);
      }
    }

    useProductsStore.getState().replaceCart(await getServerCart(token));

    return true;
  } catch {
    return false;
  }
};

/**
 * Pulls the signed-in user's server cart into the local store.
 *
 * Used where the server is the source of truth after leaving the app —
 * e.g. returning from a Stripe session: a paid order empties the server
 * cart, so the stale local copy is replaced instead of lingering.
 */
export const refreshCartFromServer = async (): Promise<boolean> => {
  const token = readAuthToken();
  if (!token) return false;

  try {
    useProductsStore.getState().replaceCart(await getServerCart(token));

    return true;
  } catch {
    return false;
  }
};
