"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { login } from "@api/auth";
import { getApiErrorMessage } from "@api/axios";
import TextField from "@components/TextField";
import Button from "@components/ui/Button";
import Form from "@components/ui/Form";
import { syncLocalCartToServer } from "../../../store/cartSync";
import { syncLocalWishlistToServer } from "../../../store/wishlistSync";
import { setAuthSession } from "../utils/session";
import type { LoginFormValues } from "../types";

const LoginForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const response = await login(values);

      setAuthSession({ token: response.token, user: response.user });
      // Merge guest cart and wishlist into the server data in the background;
      // the local copies are replaced with the server state once it lands.
      void syncLocalCartToServer();
      void syncLocalWishlistToServer();
      router.replace("/");
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, "Unable to sign in. Please try again.")
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
        className="mb-4"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email address",
          },
        })}
        error={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
        className="mb-4"
        {...register("password", {
          required: "Password is required",
        })}
        error={errors.password?.message}
      />

      {serverError && (
        <p role="alert" className="mb-4 text-sm text-red-500">
          {serverError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </Form>
  );
};

export default LoginForm;
