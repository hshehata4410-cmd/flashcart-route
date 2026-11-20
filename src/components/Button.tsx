import React from "react";

const Button = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  const classes = "bg-blue-500 text-white p-2 rounded-md " + className;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
