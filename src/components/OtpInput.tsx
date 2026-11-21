"use client";

import { useRef } from "react";

type OtpInputProps = {
  /** Number of digit boxes. Defaults to 6. */
  length?: number;
  /** The current code (digits only). */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
};

/** Row of single-digit boxes: auto-advance, backspace navigation, paste. */
const OtpInput = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  label = "Verification code",
}: OtpInputProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const focusInput = (index: number) => {
    const input = inputsRef.current[index];
    input?.focus();
    input?.select();
  };

  const setDigit = (index: number, char: string) => {
    const next = value.padEnd(length, " ").split("");
    next[index] = char;
    onChange(next.join("").slice(0, length));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;

    setDigit(index, digit);
    if (index < length - 1) focusInput(index + 1);
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        setDigit(index - 1, "");
        focusInput(index - 1);
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (event.key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    focusInput(Math.min(pasted.length, length - 1));
  };

  return (
    <div role="group" aria-label={label} className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`${label} digit ${index + 1}`}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          className="size-11 rounded-xl border border-gray-200 bg-gray-50 text-center text-lg font-bold text-gray-900 transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 sm:size-12"
        />
      ))}
    </div>
  );
};

export default OtpInput;
