"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import {
  addAddress,
  getAddresses,
  removeAddress,
  updateAddress,
} from "@api/addresses";
import { getApiErrorMessage } from "@api/axios";
import { readAuthToken } from "@features/auth/utils/session";
import type { Address, AddressInput } from "../types";
import AddressForm from "./AddressForm";
import AddressesList from "./AddressesList";

const SESSION_EXPIRED_MESSAGE =
  "Your session has expired. Please sign in again.";

type Dialog =
  | { mode: "add" }
  | { mode: "edit"; address: Address }
  | { mode: "delete"; address: Address };

/** Owns the addresses tab state: list, add, edit, and delete. */
const AddressesManager = ({
  addresses,
  onAddressesChange,
}: {
  addresses: Address[];
  onAddressesChange: (addresses: Address[]) => void;
}) => {
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const closeDialog = () => {
    if (submitting) return;
    setDialog(null);
    setFormError(null);
  };

  const handleSubmit = async (input: AddressInput) => {
    setSubmitting(true);
    setFormError(null);

    try {
      const token = readAuthToken();
      if (!token) throw new Error(SESSION_EXPIRED_MESSAGE);

      if (dialog?.mode === "edit") {
        await updateAddress(token, dialog.address._id, input);
      } else {
        await addAddress(token, input);
      }

      onAddressesChange(await getAddresses(token));
      setDialog(null);
    } catch (error) {
      setFormError(
        error instanceof Error && error.message === SESSION_EXPIRED_MESSAGE
          ? SESSION_EXPIRED_MESSAGE
          : getApiErrorMessage(error, "Unable to save the address."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (dialog?.mode !== "delete") return;

    setSubmitting(true);
    setFormError(null);

    try {
      const token = readAuthToken();
      if (!token) throw new Error(SESSION_EXPIRED_MESSAGE);

      await removeAddress(token, dialog.address._id);
      onAddressesChange(await getAddresses(token));
      setDialog(null);
    } catch (error) {
      setFormError(
        error instanceof Error && error.message === SESSION_EXPIRED_MESSAGE
          ? SESSION_EXPIRED_MESSAGE
          : getApiErrorMessage(error, "Unable to delete the address."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AddressesList
        addresses={addresses}
        headerAction={
          <Button
            type="button"
            onClick={() => {
              setFormError(null);
              setDialog({ mode: "add" });
            }}
            className="!px-4 !py-2 text-xs"
          >
            + New address
          </Button>
        }
        onEdit={(address) => {
          setFormError(null);
          setDialog({ mode: "edit", address });
        }}
        onRemove={(address) => {
          setFormError(null);
          setDialog({ mode: "delete", address });
        }}
      />

      <Modal
        open={dialog?.mode === "add" || dialog?.mode === "edit"}
        onClose={closeDialog}
        title={dialog?.mode === "edit" ? "Edit address" : "Add new address"}
      >
        <AddressForm
          key={dialog?.mode === "edit" ? dialog.address._id : "new"}
          initial={
            dialog?.mode === "edit"
              ? {
                  name: dialog.address.name,
                  details: dialog.address.details,
                  phone: dialog.address.phone,
                  city: dialog.address.city,
                }
              : undefined
          }
          submitLabel={dialog?.mode === "edit" ? "Save changes" : "Add address"}
          submitting={submitting}
          serverError={formError}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Modal
        open={dialog?.mode === "delete"}
        onClose={closeDialog}
        title="Delete address"
      >
        {dialog?.mode === "delete" && (
          <div>
            {formError && (
              <p
                role="alert"
                className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {formError}{" "}
                <Link href="/login" className="font-semibold underline">
                  Sign in
                </Link>
              </p>
            )}
            <p className="text-sm leading-6 text-gray-600">
              Delete{" "}
              <span className="font-semibold text-gray-900">
                {dialog.address.name}
              </span>{" "}
              ({dialog.address.details}, {dialog.address.city})? This cannot be
              undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={closeDialog}
                disabled={submitting}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                aria-busy={submitting}
                className="flex-1 rounded-full bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-600 disabled:cursor-wait disabled:opacity-70"
              >
                {submitting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddressesManager;
