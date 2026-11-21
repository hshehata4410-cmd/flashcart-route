import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@features/auth/types";
import { axios } from "./axios";

/** Signs a user in (`POST /auth/signin`). Throws on invalid credentials. */
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await axios.post<AuthResponse>("/auth/signin", payload);

  return data;
};

/**
 * Creates an account (`POST /auth/signup`). Throws when the email or phone is
 * already registered.
 */
export const register = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const { data } = await axios.post<AuthResponse>("/auth/signup", payload);

  return data;
};

/** Sends a password-reset code to the email (`POST /auth/forgotPasswords`). */
export const forgotPassword = async (email: string): Promise<void> => {
  await axios.post("/auth/forgotPasswords", { email });
};

/** Verifies the password-reset code (`POST /auth/verifyResetCode`). */
export const verifyResetCode = async (resetCode: string): Promise<void> => {
  await axios.post("/auth/verifyResetCode", { resetCode });
};

/** Sets the new password after a verified code (`PUT /auth/resetPassword`). */
export const resetPassword = async (
  email: string,
  newPassword: string,
): Promise<void> => {
  await axios.put("/auth/resetPassword", { email, newPassword });
};
