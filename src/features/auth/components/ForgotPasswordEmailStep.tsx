"use client";

import { useState } from "react";
import Button from "@components/ui/Button";
import TextField from "@components/TextField";
import { forgotPassword } from "@api/auth";
import { getApiErrorMessage } from "@api/axios";

/** Step 1: collects the account email and sends the reset code. */
const ForgotPasswordEmailStep = ({
  initialEmail,
  onSent,
}: {
  initialEmail: string;
  onSent: (email: string) => void;
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [serverError, setServerError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError(undefined);

    setSending(true);
    setServerError(null);

    try {
      await forgotPassword(email.trim());
      onSent(email.trim());
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, "Unable to send the code. Please try again."),
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm leading-6 text-gray-500">
        Enter your account email and we&apos;ll send you a 6-digit verification
        code.
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
        label="Email"
        name="reset-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        required
        error={emailError}
      />
      <Button type="submit" disabled={sending} className="mt-1 w-full">
        {sending ? "Sending…" : "Send code"}
      </Button>
    </form>
  );
};

export default ForgotPasswordEmailStep;
