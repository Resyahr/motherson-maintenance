"use client";

import React, { useState } from "react";
import MainTitle from "@/components/mainTitle";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardHeader, CardBody } from "@nextui-org/card"; // Using card for layout
import { BreadcrumbReusable } from "@/components/breadCrumbReusable";

interface IInventory {
  name: string;
  description?: string;
  product_code: string;
  manufacturer?: string;
  supplier?: string;
  category: string;
  location: string;
  quantity: number;
  low_stock_threshold: number;
  productImage?: File | string;
}

const CreateInventoryItems = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IInventory>();

  // Function to handle Firebase file upload
  const uploadImageToFirebase = async (file: File): Promise<string | null> => {
    try {
      const storageRef = ref(storage, `inventory/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image to Firebase:", error);
      return null;
    }
  };

  // Handle form submission
  const onSubmit: SubmitHandler<IInventory> = async (data) => {
    setIsLoading(true);
    try {
      let imageUrl = null;

      // If there's a file, upload it to Firebase
      if (files[0]) {
        imageUrl = await uploadImageToFirebase(files[0]);
      }

      // Prepare form data, including the image URL
      const formData = {
        ...data,
        productImage: imageUrl || "",
      };

      // Make the POST request to your API to create a new inventory item
      const response = await fetch("/api/inventory/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create inventory item");
      }

      const responseData = await response.json();
      setMessage(responseData.message);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (selectedFiles: File[]) => {
    setFiles(selectedFiles); // Save selected files to the state
  };

  return (
    <>
      <BreadcrumbReusable className="lg:hidden mb-10" />
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <MainTitle>Create Item</MainTitle>
          </CardHeader>
          <CardBody>
            {/* Form for creating inventory items */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full gap-6"
            >
              <div>
                <Input
                  {...register("name", { required: true })}
                  id="name"
                  label="Product Name"
                  placeholder="Enter product name"
                  isInvalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-danger text-sm mt-1">
                    Product Name is required *
                  </p>
                )}
              </div>

              <div>
                <Input
                  {...register("product_code", { required: true })}
                  id="product_code"
                  label="Product Code"
                  placeholder="Enter product code"
                  isInvalid={!!errors.product_code}
                />
                {errors.product_code && (
                  <p className="text-danger text-sm mt-1">
                    Product Code is required *
                  </p>
                )}
              </div>

              {/* Replaced the description field with NextUI's Textarea */}
              <div>
                <Textarea
                  {...register("description")}
                  label="Description"
                  variant="faded"
                  placeholder="Enter description (optional)"
                  disableAnimation
                  classNames={{
                    base: "max-w-xs",
                    input: "resize-y min-h-[40px]",
                  }}
                />
              </div>

              <div>
                <Input
                  {...register("manufacturer")}
                  id="manufacturer"
                  label="Manufacturer"
                  placeholder="Enter manufacturer"
                />
              </div>

              <div>
                <Input
                  {...register("supplier")}
                  id="supplier"
                  label="Supplier"
                  placeholder="Enter supplier"
                />
              </div>

              <div>
                <Input
                  {...register("category", { required: true })}
                  id="category"
                  label="Category"
                  placeholder="Enter category"
                  isInvalid={!!errors.category}
                />
                {errors.category && (
                  <p className="text-danger text-sm mt-1">
                    Category is required *
                  </p>
                )}
              </div>

              <div>
                <Input
                  {...register("location", { required: true })}
                  id="location"
                  label="Location"
                  placeholder="Enter location"
                  isInvalid={!!errors.location}
                />
                {errors.location && (
                  <p className="text-danger text-sm mt-1">
                    Location is required *
                  </p>
                )}
              </div>

              <div>
                <Input
                  {...register("quantity", { required: true })}
                  id="quantity"
                  type="number"
                  label="Quantity"
                  placeholder="Enter quantity"
                  isInvalid={!!errors.quantity}
                />
                {errors.quantity && (
                  <p className="text-danger text-sm mt-1">
                    Quantity is required *
                  </p>
                )}
              </div>

              <div>
                <Input
                  {...register("low_stock_threshold", { required: true })}
                  id="low_stock_threshold"
                  type="number"
                  label="Low Stock Threshold"
                  placeholder="Enter low stock threshold"
                  isInvalid={!!errors.low_stock_threshold}
                />
                {errors.low_stock_threshold && (
                  <p className="text-danger text-sm mt-1">
                    Low Stock Threshold is required *
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div className="flex flex-col gap-3 justify-center items-center">
                <label>Product Image</label>
                <FileUpload onChange={handleFileUpload} />
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full">
                Create Item
              </Button>

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
    </>
  );
};

export default CreateInventoryItems;
