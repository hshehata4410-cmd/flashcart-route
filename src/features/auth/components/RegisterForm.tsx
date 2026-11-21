"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { register as registerRequest } from "@api/auth";
import { getApiErrorMessage } from "@api/axios";
import TextField from "@components/TextField";
import Button from "@components/ui/Button";
import Form from "@components/ui/Form";
import { syncLocalCartToServer } from "../../../store/cartSync";
import { syncLocalWishlistToServer } from "../../../store/wishlistSync";
import { setAuthSession } from "../utils/session";
import type { RegisterFormValues } from "../types";

const RegisterForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = async ({
    confirmPassword,
    ...values
  }: RegisterFormValues) => {
    setServerError(null);

    try {
      const response = await registerRequest({
        ...values,
        rePassword: confirmPassword,
      });

      setAuthSession({ token: response.token, user: response.user });
      // Merge guest cart and wishlist into the server data in the background;
      // the local copies are replaced with the server state once it lands.
      void syncLocalCartToServer();
      void syncLocalWishlistToServer();
      router.replace("/");
    } catch (error) {
      setServerError(
        getApiErrorMessage(
          error,
          "Unable to create your account. Please try again.",
        ),
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Name"
        type="text"
        placeholder="Your name"
        autoComplete="name"
        required
        className="mb-4"
        {...register("name", {
          required: "Name is required",
          minLength: {
            value: 3,
            message: "Name must be at least 3 characters",
          },
        })}
        error={errors.name?.message}
      />

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
        placeholder="At least 8 characters"
        autoComplete="new-password"
        required
        className="mb-4"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
        error={errors.password?.message}
      />

      <TextField
        label="Confirm Password"
        type="password"
        placeholder="Repeat your password"
        autoComplete="new-password"
        required
        className="mb-4"
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) =>
            value === getValues("password") || "Passwords do not match",
        })}
        error={errors.confirmPassword?.message}
      />

      <TextField
        label="Phone"
        type="tel"
        placeholder="01xxxxxxxxx"
        autoComplete="tel"
        required
        className="mb-4"
        {...register("phone", {
          required: "Phone number is required",
          pattern: {
            value: /^01[0125][0-9]{8}$/,
            message: "Please enter a valid Egyptian phone number",
          },
        })}
        error={errors.phone?.message}
      />

      {serverError && (
        <p role="alert" className="mb-4 text-sm text-red-500">
          {serverError}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </Form>
  );
};

export default RegisterForm;
