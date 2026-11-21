import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "react-toastify";
import {
  addServerCartItem,
  removeServerCartItem,
  setServerCartQuantity,
} from "@api/cart";
import { addServerWishlistItem, removeServerWishlistItem } from "@api/wishlist";
import { readAuthToken } from "@features/auth/utils/session";
import type { CartItem } from "@features/products/types";

type ProductsState = {
  favorites: string[];
  cart: CartItem[];
  toggleFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  incrementCartItem: (productId: string) => Promise<void>;
  decrementCartItem: (productId: string) => Promise<void>;
  /** Replaces the whole cart (used after syncing with the server cart). */
  replaceCart: (cart: CartItem[]) => void;
  /** Empties the local cart (used on sign out). */
  clearCart: () => void;
  /** Replaces the whole wishlist (used after syncing with the server wishlist). */
  replaceFavorites: (favorites: string[]) => void;
  /** Empties the local wishlist (used on sign out). */
  clearFavorites: () => void;
};

/**
 * Optimistic mirror of a local change to the signed-in user's server data.
 * Guests have no token so this resolves immediately for them. While signed
 * in, the change is pushed and awaited; when the server rejects it, the
 * passed revert restores the previous state and the failure is raised in a
 * toast.
 */
const mirrorToServer = async (
  revert: () => void,
  sync: (token: string) => Promise<unknown>
): Promise<void> => {
  if (typeof document === "undefined") return;

  const token = readAuthToken();
  if (!token) return;

  try {
    await sync(token);
  } catch {
    revert();
    toast.error("Cannot be added nor removed item");
  }
};

/** Pushes the local quantity of one product, deleting it when it hits zero. */
const pushQuantity = (token: string, productId: string, quantity: number) => {
  if (quantity <= 0) return removeServerCartItem(token, productId);

  return setServerCartQuantity(token, productId, quantity).catch(() =>
    addServerCartItem(token, productId).then(() =>
      quantity > 1
        ? setServerCartQuantity(token, productId, quantity)
        : undefined
    )
  );
};

/**
 * Client-side cart and wishlist. Persisted to localStorage through Zustand's
 * persist middleware; rehydration is triggered from `ProductsStoreHydrator`
 * so server-rendered markup stays in sync.
 *
 * The cart and wishlist additionally mirror to the signed-in user's server
 * data: guest items are merged server-side on sign-in (`syncLocalCartToServer`,
 * `syncLocalWishlistToServer`), every change is pushed optimistically while
 * signed in — a server rejection reverts the local state and raises a toast —
 * and sign-out clears the local copies so the next guest starts over.
 */
export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      favorites: [],
      cart: [],

      toggleFavorite: async (productId) => {
        const previousFavorites = get().favorites;
        const adding = !previousFavorites.includes(productId);

        set((state) => ({
          favorites: adding
            ? [...state.favorites, productId]
            : state.favorites.filter((id) => id !== productId),
        }));

        await mirrorToServer(
          () => set({ favorites: previousFavorites }),
          (token) =>
            adding
              ? addServerWishlistItem(token, productId)
              : removeServerWishlistItem(token, productId)
        );
      },

      removeFavorite: async (productId) => {
        const previousFavorites = get().favorites;

        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId),
        }));

        await mirrorToServer(
          () => set({ favorites: previousFavorites }),
          (token) => removeServerWishlistItem(token, productId)
        );
      },

      addToCart: async (productId) => {
        const previousCart = get().cart;
        if (previousCart.some((item) => item.id === productId)) return;

        set((state) => ({
          cart: [...state.cart, { id: productId, quantity: 1 }],
        }));

        await mirrorToServer(
          () => set({ cart: previousCart }),
          (token) => addServerCartItem(token, productId)
        );
      },

      removeFromCart: async (productId) => {
        const previousCart = get().cart;

        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));

        await mirrorToServer(
          () => set({ cart: previousCart }),
          (token) => removeServerCartItem(token, productId)
        );
      },

      incrementCartItem: async (productId) => {
        const previousCart = get().cart;
        const quantity =
          (previousCart.find((item) => item.id === productId)?.quantity ?? 0) +
          1;

        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }));

        await mirrorToServer(
          () => set({ cart: previousCart }),
          (token) => pushQuantity(token, productId, quantity)
        );
      },

      decrementCartItem: async (productId) => {
        const previousCart = get().cart;
        const quantity =
          (previousCart.find((item) => item.id === productId)?.quantity ?? 0) -
          1;

        set((state) => ({
          cart: state.cart.flatMap((item) => {
            if (item.id !== productId) return [item];
            if (item.quantity <= 1) return [];

            return [{ ...item, quantity: item.quantity - 1 }];
          }),
        }));

        await mirrorToServer(
          () => set({ cart: previousCart }),
          (token) => pushQuantity(token, productId, quantity)
        );
      },

      replaceCart: (cart) => set({ cart }),

      clearCart: () => set({ cart: [] }),

      replaceFavorites: (favorites) => set({ favorites }),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "flashcart-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        cart: state.cart,
      }),
      skipHydration: true,
    }
  )
);
