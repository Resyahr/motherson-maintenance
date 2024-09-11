"use client";

import React, { useState } from "react";
import MainTitle from "@/components/mainTitle";
import { IUser } from "@/lib/schemas/userSchema";
import { useForm, SubmitHandler } from "react-hook-form";

import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody } from "@nextui-org/card"; // Using card for layout

const CreateUser: React.FC = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>();

  // This will handle the form submission
  const onSubmit: SubmitHandler<IUser> = async (data: IUser) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const responseData = await response.json();
      setMessage(responseData.message);

      // Optionally reset the form
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-background">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <MainTitle>Create User</MainTitle>
        </CardHeader>
        <CardBody>
          {/* Form for creating a user */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-6">
            <div>
              <Input
                label="Name"
                placeholder="Enter user's first name"
                {...register("name", { required: true })}
                isInvalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-danger text-sm mt-1">Name is required *</p>
              )}
            </div>

            <div>
              <Input
                label="Last Name"
                placeholder="Enter user's last name"
                {...register("lastName", { required: true })}
                isInvalid={!!errors.lastName}
              />
              {errors.lastName && (
                <p className="text-danger text-sm mt-1">
                  Last name is required *
                </p>
              )}
            </div>

            <div>
              <Input
                label="Email"
                placeholder="Enter user's email"
                {...register("email", { required: true })}
                isInvalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-danger text-sm mt-1">Email is required *</p>
              )}
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter a strong password"
                {...register("password", { required: true })}
                isInvalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-danger text-sm mt-1">
                  Password is required *
                </p>
              )}
            </div>

            <div>
              <Select
                label="Role"
                placeholder="Select role"
                {...register("role", { required: true })}
                className={errors.role ? "border-danger" : ""}
              >
                <SelectItem key={"technician"}> Technician </SelectItem>
                <SelectItem key={"admin"}> Admin </SelectItem>
              </Select>
              {errors.role && (
                <p className="text-danger text-sm mt-1">Role is required *</p>
              )}
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full">
              Create User
            </Button>

            {/* Display message after form submission */}
            {message && (
              <p
                className={
                  message.includes("successfully")
                    ? "text-success text-center mt-4"
                    : "text-danger text-center mt-4"
                }
              >
                {message}
              </p>
            )}
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateUser;
