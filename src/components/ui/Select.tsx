"use client";

import { useEffect, useId, useRef, useState } from "react";
import CheckIcon from "@svg/CheckIcon";
import ChevronDownIcon from "@svg/ChevronDownIcon";

export type SelectOption = {
  label: string;
  value: string;
};

type BaseSelectProps = {
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  /** Shows a spinner and disables the control while options are being fetched. */
  loading?: boolean;
  className?: string;
  id?: string;
};

type SingleSelectProps = BaseSelectProps & {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
};

type MultipleSelectProps = BaseSelectProps & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
};

type SelectProps = SingleSelectProps | MultipleSelectProps;

/**
 * Dropdown menu for one or many options. Single mode closes after choosing;
 * multiple mode stays open so several options can be toggled.
 */
const Select = (props: SelectProps) => {
  const {
    options,
    placeholder = "Select...",
    disabled = false,
    loading = false,
    className,
    id,
  } = props;

  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const listboxId = `${buttonId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectedValues = props.multiple ? props.value : [props.value];

  const isSelected = (value: string) => selectedValues.includes(value);

  const selectedLabels = options
    .filter((option) => isSelected(option.value))
    .map((option) => option.label);

  const label =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(", ")
        : `${selectedLabels.length} selected`;

  const handleSelect = (value: string) => {
    if (props.multiple) {
      props.onChange(
        props.value.includes(value)
          ? props.value.filter((item) => item !== value)
          : [...props.value, value],
      );

      return;
    }

    props.onChange(value);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={["relative", className].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        id={buttonId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm transition-colors hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className={`truncate ${
            selectedLabels.length === 0 ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {label}
        </span>
        {loading ? (
          <span
            aria-hidden="true"
            className="size-4 shrink-0 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
          />
        ) : (
          <ChevronDownIcon
            className={`size-2.5 shrink-0 text-gray-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable={props.multiple || undefined}
          className="absolute right-0 left-0 z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
        >
          {options.map((option) => {
            const selected = isSelected(option.value);

            return (
              <li
                key={option.value || "empty"}
                role="option"
                aria-selected={selected}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={[
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    selected
                      ? "bg-primary-50 font-medium text-primary-600"
                      : "text-gray-600 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <span className="truncate">{option.label}</span>
                  {selected && <CheckIcon className="size-3.5 shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;
