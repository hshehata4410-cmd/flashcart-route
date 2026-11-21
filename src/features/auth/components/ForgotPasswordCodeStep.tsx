"use client";

import { useEffect, useState } from "react";
import Button from "@components/ui/Button";
import OtpInput from "@components/OtpInput";
import { forgotPassword, verifyResetCode } from "@api/auth";
import { getApiErrorMessage } from "@api/axios";

/** Seconds before the reset code can be re-requested. */
const RESEND_SECONDS = 90;

const formatCountdown = (totalSeconds: number) =>
  `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;

/** Step 2: verifies the 6-digit code, with a timed resend. */
const ForgotPasswordCodeStep = ({
  email,
  onVerified,
  onEditEmail,
}: {
  email: string;
  onVerified: () => void;
  onEditEmail: () => void;
}) => {
  const [code, setCode] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(
      () => setSecondsLeft((seconds) => Math.max(0, seconds - 1)),
      1000,
    );

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const resendCode = async () => {
    if (sending) return;

    setSending(true);
    setServerError(null);

    try {
      await forgotPassword(email);
      setCode("");
      setSecondsLeft(RESEND_SECONDS);
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, "Unable to send the code. Please try again."),
      );
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (verifying || code.length < 6) return;

    setVerifying(true);
    setServerError(null);

    try {
      await verifyResetCode(code);
      onVerified();
    } catch (error) {
      setServerError(
        getApiErrorMessage(error, "Invalid or expired code. Please try again."),
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm leading-6 text-gray-500">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-gray-900">{email}</span>. Enter it
        below.{" "}
        <button
          type="button"
          onClick={onEditEmail}
          className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
        >
          Use a different email
        </button>
      </p>
      {serverError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {serverError}
        </p>
      )}
      <OtpInput value={code} onChange={setCode} disabled={verifying} />
      <Button
        type="submit"
        disabled={verifying || code.length < 6}
        className="mt-1 w-full"
      >
        {verifying ? "Verifying…" : "Verify code"}
      </Button>
      <div className="text-center text-sm">
        {secondsLeft > 0 ? (
          <p className="text-gray-400">
            Resend code in {formatCountdown(secondsLeft)}
          </p>
        ) : (
          <button
            type="button"
            onClick={resendCode}
            disabled={sending}
            className="font-semibold text-primary-600 transition-colors hover:text-primary-700 disabled:opacity-60"
          >
            {sending ? "Sending…" : "Resend code"}
          </button>
        )}
      </div>
    </form>
  );
};

export default ForgotPasswordCodeStep;
