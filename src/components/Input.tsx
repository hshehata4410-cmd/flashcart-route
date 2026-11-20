import React from "react";

const Input = ({
  label,
  type,
  placeholder,
  required,
  error,
  ...props
}: {
  label: string;
  type: string;
  placeholder: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        className="border-2 border-gray-300 rounded-md p-2"
        type={type}
        placeholder={placeholder}
        {...props}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
