"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useProductsStore } from "../../../store/useProductsStore";
import {
  clearAuthCookie,
  readAuthCookie,
  subscribeToAuth,
} from "./session";

const getServerSnapshot = () => false;

/**
 * Client-side view of the session cookie, used to swap auth actions in the
 * navbar. All callers share one store, so signing out updates every action.
 */
export const useAuth = () => {
  const router = useRouter();

  const isAuthenticated = useSyncExternalStore(
    subscribeToAuth,
    readAuthCookie,
    getServerSnapshot,
  );

  const logout = () => {
    clearAuthCookie();
    // Drop the local cart and wishlist so the next guest starts over; the
    // server keeps the signed-in user's data for their next sign-in.
    useProductsStore.getState().clearCart();
    useProductsStore.getState().clearFavorites();
    router.push("/");
    router.refresh();
  };

  return { isAuthenticated, logout };
};
