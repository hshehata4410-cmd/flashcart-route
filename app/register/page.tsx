import Link from "next/link";
import AuthCard from "@features/auth/components/AuthCard";
import GuestOnly from "@features/auth/components/GuestOnly";
import RegisterForm from "@features/auth/components/RegisterForm";

const Register = () => {
  return (
    <GuestOnly>
      <AuthCard
        title="Create an account"
        subtitle="Join FreshCart and start shopping"
        footer={
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              Sign in
            </Link>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </GuestOnly>
  );
};

export default Register;
