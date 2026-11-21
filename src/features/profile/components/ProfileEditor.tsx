"use client";

import { useState } from "react";
import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import TextField from "@components/TextField";
import { updateProfile } from "@api/profile";
import { getApiErrorMessage } from "@api/axios";
import {
  readAuthToken,
  updateAuthUserSnapshot,
} from "@features/auth/utils/session";
import type { ProfileUpdateInput, ProfileUser } from "../types";

const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please sign in again.";

/**
 * "Edit profile info" button and dialog under the Account tab: edits the
 * signed-in user's name, email, and phone (`PUT /users/updateMe`).
 */
const ProfileEditor = ({
  user,
  onProfileChange,
}: {
  user: ProfileUser;
  onProfileChange: (user: ProfileUser) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [errors, setErrors] = useState<Partial<ProfileUpdateInput>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const openDialog = () => {
    setName(user.name);
    setEmail(user.email ?? "");
    setPhone(user.phone ?? "");
    setErrors({});
    setServerError(null);
    setOpen(true);
  };

  const closeDialog = () => {
    if (submitting) return;
    setOpen(false);
    setServerError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: Partial<ProfileUpdateInput> = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!phone.trim()) nextErrors.phone = "Phone number is required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setServerError(null);

    try {
      const token = readAuthToken();
      if (!token) throw new Error(SESSION_EXPIRED_MESSAGE);

      const updated = await updateProfile(token, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      updateAuthUserSnapshot({
        name: updated.name,
        email: updated.email ?? user.email ?? "",
        role: updated.role ?? user.role ?? "",
      });
      onProfileChange(updated);
      setOpen(false);
    } catch (error) {
      setServerError(
        error instanceof Error && error.message === SESSION_EXPIRED_MESSAGE
          ? SESSION_EXPIRED_MESSAGE
          : getApiErrorMessage(error, "Unable to update your profile."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Button type="button" onClick={openDialog} className="!px-4 !py-2 text-xs">
        Edit profile info
      </Button>

      <Modal open={open} onClose={closeDialog} title="Edit profile info">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {serverError && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {serverError}
            </p>
          )}

          <TextField
            label="Name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            required
            error={errors.name}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            error={errors.email}
          />

          <TextField
            label="Phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="01xxxxxxxxx"
            required
            error={errors.phone}
          />

          <Button type="submit" disabled={submitting} className="mt-1 w-full">
            {submitting ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ProfileEditor;
