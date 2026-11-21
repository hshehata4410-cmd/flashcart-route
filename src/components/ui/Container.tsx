import React from "react";

type ContainerProps = React.ComponentPropsWithRef<"div">;

/**
 * Page-width wrapper shared by the navbar, footer, and page sections. Matches
 * the `container` utility defined in `app/globals.css`.
 */
const Container = ({ className, children, ...props }: ContainerProps) => {
  return (
    <div
      className={["container mx-auto px-4", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
