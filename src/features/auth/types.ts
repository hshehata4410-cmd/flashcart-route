export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
};

export type AuthUser = {
  name: string;
  email: string;
  role: string;
};

/** `/auth/signin` and `/auth/signup` return the same session payload. */
export type AuthResponse = {
  message: string;
  user: AuthUser;
  token: string;
};
