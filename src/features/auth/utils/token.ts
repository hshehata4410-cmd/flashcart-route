/**
 * Claims embedded in the session token. The token carries the name and role
 * but not the email.
 */
export type AuthTokenClaims = {
  id?: string;
  name?: string;
  role?: string;
  exp?: number;
};

/**
 * Reads the claims inside a session token without verifying its signature.
 *
 * Display only: the API still authorizes each request with the token itself.
 * Works on both server and client.
 */
export const decodeAuthToken = (token: string): AuthTokenClaims | null => {
  const payload = token.split(".")[1];

  if (!payload) return null;

  try {
    if (typeof Buffer !== "undefined") {
      return JSON.parse(
        Buffer.from(payload, "base64url").toString("utf8"),
      ) as AuthTokenClaims;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded)) as AuthTokenClaims;
  } catch {
    return null;
  }
};
