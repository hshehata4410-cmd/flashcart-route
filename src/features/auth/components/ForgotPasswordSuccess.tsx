"use client";

import Button from "@components/ui/Button";

/** Final step: confirms the password was reset. */
const ForgotPasswordSuccess = ({ onClose }: { onClose: () => void }) => (
  <div className="py-4 text-center">
    <p className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-50 text-xl text-green-600">
      ✓
    </p>
    <p className="mt-4 text-sm font-semibold text-gray-900">
      Password reset successfully
    </p>
    <p className="mt-1 text-sm text-gray-500">Sign in with your new password.</p>
    <Button type="button" onClick={onClose} className="mt-6 w-full">
      Back to sign in
    </Button>
  </div>
);

export default ForgotPasswordSuccess;
