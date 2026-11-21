import React from "react";
import Input from "@components/ui/Input";
import Label from "@components/ui/Label";

type TextFieldProps = {
  /** Visible field label, associated with the input automatically. */
  label: string;
  /** Validation message, forwarded to the input's error state. */
  error?: string;
  /** Classes for the wrapper, e.g. spacing between fields. */
  className?: string;
} & Omit<React.ComponentPropsWithRef<"input">, "className">;

/**
 * Label + Input pair with a shared id, so the two stay associated without the
 * caller wiring up `htmlFor`/`id` by hand.
 */
const TextField = ({
  label,
  error,
  className,
  id,
  ...props
}: TextFieldProps) => {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  const wrapperClasses = ["flex flex-col gap-2", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      <Label htmlFor={fieldId} required={props.required}>
        {label}
      </Label>
      <Input id={fieldId} error={error} {...props} />
    </div>
  );
};

export default TextField;
