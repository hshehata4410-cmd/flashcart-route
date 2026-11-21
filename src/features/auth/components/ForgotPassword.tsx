"use client";

import { useState } from "react";
import Modal from "@components/ui/Modal";
import ForgotPasswordCodeStep from "./ForgotPasswordCodeStep";
import ForgotPasswordEmailStep from "./ForgotPasswordEmailStep";
import ForgotPasswordPasswordStep from "./ForgotPasswordPasswordStep";
import ForgotPasswordSuccess from "./ForgotPasswordSuccess";

type Step = "email" | "code" | "password" | "done";

/**
 * "Forgot password?" trigger and modal. Each step owns its own form and API
 * call; this component only owns the dialog visibility and step navigation.
 */
const ForgotPassword = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const close = () => {
    setOpen(false);
    setStep("email");
    setEmail("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
      >
        Forgot password?
      </button>

      <Modal open={open} onClose={close} title="Reset password">
        {step === "email" && (
          <ForgotPasswordEmailStep
            initialEmail={email}
            onSent={(sentEmail) => {
              setEmail(sentEmail);
              setStep("code");
            }}
          />
        )}

        {step === "code" && (
          <ForgotPasswordCodeStep
            key={email}
            email={email}
            onVerified={() => setStep("password")}
            onEditEmail={() => setStep("email")}
          />
        )}

        {step === "password" && (
          <ForgotPasswordPasswordStep
            email={email}
            onDone={() => setStep("done")}
          />
        )}

        {step === "done" && <ForgotPasswordSuccess onClose={close} />}
      </Modal>
    </>
  );
};

export default ForgotPassword;
