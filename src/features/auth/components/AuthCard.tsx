import React from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Rendered under the form, e.g. "Don't have an account? Create one". */
  footer?: React.ReactNode;
};

/**
 * Shared shell for the auth pages, so login and register stay visually identical.
 */
const AuthCard = ({ title, subtitle, children, footer }: AuthCardProps) => {
  return (
    <div className="flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>

        {children}

        {footer && (
          <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
