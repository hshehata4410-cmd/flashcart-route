"use client";

import React, { useState } from "react";
import EyeIcon from "@svg/EyeIcon";
import EyeSlashIcon from "@svg/EyeSlashIcon";

type InputProps = {
  /** Validation message. Renders under the field and switches it to the error style. */
  error?: string;
} & React.ComponentPropsWithRef<"input">;

const Input = ({
  value,
  onChange,
  error,
  className,
  id,
  type,
  ...props
}: InputProps) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";

  const stateClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "border-gray-200 focus:border-primary-500 focus:ring-primary-500/20";

  const classes = [
    "w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-700",
    "placeholder:text-gray-400 transition-colors",
    "focus:bg-white focus:outline-none focus:ring-2",
    "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400",
    isPassword && "pr-11",
    stateClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <input
          id={inputId}
          value={value}
          onChange={onChange}
          type={isPassword && isPasswordVisible ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={classes}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            // Keep the caret in the input instead of moving focus to the toggle.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            aria-pressed={isPasswordVisible}
            className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
