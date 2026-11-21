import axios, { isAxiosError } from "axios";

export const axiosBase = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v1",
});

export { axiosBase as axios };

/** Versioned client for the v2 endpoints (cart, orders, …). */
export const axiosV2 = axios.create({
  baseURL: "https://ecommerce.routemisr.com/api/v2",
});

/**
 * Extracts the API's `message` from a failed request, falling back to
 * caller-supplied copy for network errors or unexpected bodies.
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};
