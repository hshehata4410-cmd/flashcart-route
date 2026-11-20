"use client";
import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { useForm } from "react-hook-form";

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>();

  const password = watch("password");

  const onSubmit = (data: SignUpFormValues) => {
    console.log("Sign Up Data:", data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body p-4">
          <h2 className="card-title">Sign Up</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Name"
              type="text"
              placeholder="Name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              error={errors.name?.message}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              error={errors.confirmPassword?.message}
            />

            <Input
              label="Phone"
              type="text"
              placeholder="Phone"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^01[0125][0-9]{8}$/,
                  message: "Please enter a valid Egyptian phone number",
                },
              })}
              error={errors.phone?.message}
            />

            <Button type="submit" className="mt-2">
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
