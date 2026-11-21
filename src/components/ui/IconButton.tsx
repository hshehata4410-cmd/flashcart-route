import React from "react";
import Button from "@components/ui/Button";

type IconButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton = ({ children, ...props }: IconButtonProps) => {
  return (
    <Button type="button" variant="icon" {...props}>
      {children}
    </Button>
  );
};

export default IconButton;
