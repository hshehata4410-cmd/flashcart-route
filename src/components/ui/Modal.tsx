"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import XMarkIcon from "@svg/XMarkIcon";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

/**
 * Simple dialog rendered over the page: closes on Escape, on the backdrop, or
 * on the close button, and locks background scrolling while open.
 */
const Modal = ({ open, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Portal out of the surrounding tree: callers like ForgotPassword render
  // inside another <form> (the login form), and nested forms are invalid —
  // the inner form would submit the outer one instead.
  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-24 sm:items-center sm:pt-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl"
      >
        <div className="mb-3 flex items-center gap-3">
          {title && (
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto flex size-9 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <XMarkIcon className="size-4 text-gray-600" />
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
