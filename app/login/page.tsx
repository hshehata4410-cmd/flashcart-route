import Link from "next/link";
import AuthCard from "@features/auth/components/AuthCard";
import GuestOnly from "@features/auth/components/GuestOnly";
import LoginForm from "@features/auth/components/LoginForm";
import ForgotPassword from "@/src/features/auth/components/ForgotPassword";

const Login = () => {
  return (
    <GuestOnly>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to your FreshCart account"
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
            >
              Create one
            </Link>
          </>
        }
      >
        <LoginForm />
        <div className="mt-3 text-center">
          <ForgotPassword />
        </div>
      </AuthCard>
    </GuestOnly>
  );
};

export default Login;
