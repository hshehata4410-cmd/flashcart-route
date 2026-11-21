"use client";

import { useState } from "react";
import Button from "@components/ui/Button";
import TextField from "@components/TextField";
import { resetPassword } from "@api/auth";
import { getApiErrorMessage } from "@api/axios";

/** Step 3: chooses a new password after a verified code. */
const ForgotPasswordPasswordStep = ({
  email,
  onDone,
}: {
  email: string;
  onDone: () => void;
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [serverError, setServerError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (resetting) return;

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError(undefined);

    setResetting(true);
    setServerError(null);

    try {
      await resetPassword(email, newPassword);
      onDone();
    } catch (error) {
      setServerError(
        getApiErrorMessage(
          error,
          "Unable to reset your password. Please try again.",
        ),
      );
    } finally {
      setResetting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm leading-6 text-gray-500">
        Code verified. Choose a new password for{" "}
        <span className="font-semibold text-gray-900">{email}</span>.
      </p>
      {serverError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {serverError}
        </p>
      )}
      <TextField
        label="New password"
        name="new-password"
        type="password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        placeholder="••••••••"
        autoComplete="new-password"
        required
        error={passwordError}
      />
      <TextField
        label="Confirm new password"
        name="confirm-password"
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="••••••••"
        autoComplete="new-password"
        required
      />
      <Button type="submit" disabled={resetting} className="mt-1 w-full">
        {resetting ? "Saving…" : "Reset password"}
      </Button>
    </form>
  );
};

export default ForgotPasswordPasswordStep;
