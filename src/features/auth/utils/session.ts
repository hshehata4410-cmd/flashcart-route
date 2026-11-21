import type { AuthUser } from "../types";

/** Name of the cookie that marks a signed-in session. Shared with `proxy.ts`. */
export const AUTH_COOKIE_NAME = "token";

/**
 * Cookie holding the display-only user snapshot returned by sign in / sign up.
 * The session token doesn't carry the email, so the profile screen reads it
 * from here.
 */
export const AUTH_USER_COOKIE_NAME = "auth-user";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const AUTH_CHANGE_EVENT = "flashcart:auth-change";

/** Notifies `useAuth` subscribers after the cookie changes. */
const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const subscribeToAuth = (onChange: () => void) => {
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);

  return () => window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
};

/** Whether a non-empty session cookie is present. */
export const readAuthCookie = () =>
  document.cookie
    .split("; ")
    .some(
      (entry) =>
        entry.startsWith(`${AUTH_COOKIE_NAME}=`) &&
        entry.length > AUTH_COOKIE_NAME.length + 1,
    );

/**
 * Persists the session token and user snapshot in cookies so `proxy.ts` can
 * see the session and the profile screen can show the signed-in user. The API
 * returns both from sign in / sign up.
 */
export const setAuthSession = ({
  token,
  user,
}: {
  token: string;
  user: AuthUser;
}) => {
  const cookieOptions = [
    "path=/",
    `max-age=${MAX_AGE_SECONDS}`,
    "samesite=lax",
  ].join("; ");

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; ${cookieOptions}`;
  document.cookie = `${AUTH_USER_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(user),
  )}; ${cookieOptions}`;

  notifyAuthChange();
};

/** Reads the raw session token, e.g. for authenticated API calls. */
export const readAuthToken = (): string | null => {
  const entry = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!entry) return null;

  const value = decodeURIComponent(entry.slice(AUTH_COOKIE_NAME.length + 1));

  return value || null;
};

/** Removes the session cookies, e.g. on sign out. */
export const clearAuthCookie = () => {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
  document.cookie = `${AUTH_USER_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;

  notifyAuthChange();
};

/**
 * Rewrites only the user snapshot cookie, e.g. after editing the profile,
 * so a reload keeps showing the updated info.
 */
export const updateAuthUserSnapshot = (user: AuthUser) => {
  const cookieOptions = [
    "path=/",
    `max-age=${MAX_AGE_SECONDS}`,
    "samesite=lax",
  ].join("; ");

  document.cookie = `${AUTH_USER_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(user),
  )}; ${cookieOptions}`;

  notifyAuthChange();
};
