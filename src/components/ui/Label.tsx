import React from "react";

type LabelProps = {
  /** Appends a red asterisk to mark the field as required. */
  required?: boolean;
} & React.ComponentPropsWithRef<"label">;

const Label = ({ children, required, className, ...props }: LabelProps) => {
  const classes = ["text-sm font-medium text-gray-700", className]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes} {...props}>
      {children}
      {required && (
        <span className="ml-0.5 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
};

export default Label;
