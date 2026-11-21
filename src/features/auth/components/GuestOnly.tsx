"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../utils/useAuth";

/**
 * Client-side counterpart to the proxy's guest-only rule. Proxy handles full
 * page requests, but a back/forward navigation can restore `/login` from the
 * router cache without hitting the server, so signed-in users are sent home
 * here as well.
 */
const GuestOnly = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default GuestOnly;
