"use client";

import { useSyncExternalStore } from "react";
import { decodeAuthToken } from "@features/auth/utils/token";
import {
  readAuthToken,
  subscribeToAuth,
} from "@features/auth/utils/session";

const getServerSnapshot = () => null as string | null;

const getSnapshot = (): string | null => {
  const token = readAuthToken();
  if (!token) return null;

  return decodeAuthToken(token)?.id ?? null;
};

/**
 * Client-side view of the signed-in user's id (from the session token),
 * kept in sync with sign in/out. Returns null for guests.
 */
export const useCurrentUserId = (): string | null =>
  useSyncExternalStore(subscribeToAuth, getSnapshot, getServerSnapshot);
