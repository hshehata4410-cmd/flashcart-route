import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "icon";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, variant = "primary", ...props }: ButtonProps) => {
  const { className, ...rest } = props;

  const baseClasses =
    "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed";

  const variantClasses =
    variant === "icon"
      ? "size-9 cursor-pointer rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white focus-visible:ring-primary-500/30 disabled:opacity-60"
      : "gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 hover:bg-primary-700 focus-visible:ring-primary-500/40 disabled:opacity-60";

  const classes = [baseClasses, variantClasses, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
