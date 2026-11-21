import { decodeAuthToken } from "@features/auth/utils/token";
import type { ProfileUser } from "../types";

const parseStoredUser = (raw?: string): ProfileUser | null => {
  if (!raw) return null;

  let json = raw;

  // Cookies are URL-encoded when written; tolerate both forms.
  try {
    json = decodeURIComponent(raw);
  } catch {
    // Keep the raw value if it isn't valid percent-encoding.
  }

  try {
    const parsed = JSON.parse(json) as Partial<ProfileUser>;

    if (typeof parsed.name !== "string" || !parsed.name) return null;

    return {
      name: parsed.name,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
      role: typeof parsed.role === "string" ? parsed.role : undefined,
    };
  } catch {
    return null;
  }
};

/**
 * Resolves the user shown on the profile screen: the snapshot saved at sign in
 * (which includes the email) or, for sessions started before it existed, the
 * claims inside the session token.
 */
export const readProfileUser = (
  storedUser?: string,
  token?: string,
): ProfileUser | null => {
  const stored = parseStoredUser(storedUser);

  if (stored) return stored;

  const claims = token ? decodeAuthToken(token) : null;

  if (!claims?.name) return null;

  return { name: claims.name, role: claims.role };
};
