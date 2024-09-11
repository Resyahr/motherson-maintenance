"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

interface SignInFormInputs {
  username: string;
  password: string;
}

const SignInPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    setLoading(true);
    setErrorMessage("");

    const res = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-transparent z-20">
      {/* Logo */}
      <Image
        src={logo}
        alt="Motherson Logo"
        className="mb-6 h-16 w-auto object-contain"
      />

      {/* Sign In Form */}
      <div className="bg-white dark:bg-neutral-900 shadow-xl rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
          Sign In to Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Username Input */}
          <div>
            <Input
              type="text"
              label="Username"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
              isInvalid={!!errors.username}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              isInvalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            color="primary"
            isLoading={loading}
            className="w-full"
            variant="shadow"
          >
            Sign In
          </Button>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
