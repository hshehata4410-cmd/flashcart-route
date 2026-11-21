"use client";

import { useState } from "react";
import Button from "@components/ui/Button";
import TextField from "@components/TextField";
import type { AddressInput } from "../types";

type AddressFormProps = {
  initial?: AddressInput;
  submitLabel: string;
  submitting: boolean;
  serverError: string | null;
  onSubmit: (input: AddressInput) => void;
};

const EMPTY_INPUT: AddressInput = { name: "", details: "", phone: "", city: "" };

/** Shared add / edit form: label, details, phone, and city. */
const AddressForm = ({
  initial = EMPTY_INPUT,
  submitLabel,
  submitting,
  serverError,
  onSubmit,
}: AddressFormProps) => {
  const [name, setName] = useState(initial.name);
  const [details, setDetails] = useState(initial.details);
  const [phone, setPhone] = useState(initial.phone);
  const [city, setCity] = useState(initial.city);
  const [errors, setErrors] = useState<Partial<AddressInput>>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<AddressInput> = {};
    if (!name.trim()) nextErrors.name = "Address label is required";
    if (!details.trim()) nextErrors.details = "Address details are required";
    if (!phone.trim()) nextErrors.phone = "Phone number is required";
    if (!city.trim()) nextErrors.city = "City is required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      name: name.trim(),
      details: details.trim(),
      phone: phone.trim(),
      city: city.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {serverError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </p>
      )}

      <TextField
        label="Address label"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Home, Work…"
        required
        error={errors.name}
      />

      <TextField
        label="Address details"
        name="details"
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        placeholder="Street, building, apartment…"
        required
        error={errors.details}
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

      <TextField
        label="City"
        name="city"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Cairo"
        required
        error={errors.city}
      />

      <Button type="submit" disabled={submitting} className="mt-1 w-full">
        {submitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
};

export default AddressForm;
