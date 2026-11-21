import React from "react";

type FormProps = React.ComponentPropsWithRef<"form">;

/**
 * Form wrapper with native validation off by default, so the only validation
 * messages shown are the ones we render ourselves (e.g. react-hook-form errors).
 */
const Form = ({
  noValidate = true,
  className,
  children,
  ...props
}: FormProps) => {
  return (
    <form noValidate={noValidate} className={className} {...props}>
      {children}
    </form>
  );
};

export default Form;
