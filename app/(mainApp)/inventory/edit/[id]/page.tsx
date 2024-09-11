"use client";

import React, { useState, useEffect } from "react";
import MainTitle from "@/components/mainTitle";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner"; // Import Spinner for loading state
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";
import { FileUpload } from "@/components/ui/file-upload";
import { Lens } from "@/components/ui/lens"; // Import the Lens component
import Image from "next/image"; // Import Next.js Image for better performance
import { useParams, useRouter } from "next/navigation";
import axios from "axios"; // For API calls
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card"; // For layout

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

const EditInventoryItems = () => {
  const  { id }  = useParams(); // Get item id from URL
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // Add fetching state
  const [files, setFiles] = useState<File[]>([]); // For uploading a new file
  const [existingImage, setExistingImage] = useState<string | null>(null); // Store existing image URL
  const [hovering, setHovering] = useState(false); // For Lens hover effect

  const router = useRouter();

  // State to manage form values
  const [formValues, setFormValues] = useState<IInventory>({
    name: "",
    description: "",
    product_code: "",
    manufacturer: "",
    supplier: "",
    category: "",
    location: "",
    quantity: 0,
    low_stock_threshold: 0,
    productImage: "",
  });

  // Fetch existing product data by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/inventory/${id}`);
        if (data) {
          setExistingImage(data.productImage || null); // Set existing image URL

          // Set form values based on fetched data
          setFormValues({
            name: data.name || "",
            description: data.description || "",
            product_code: data.product_code || "",
            manufacturer: data.manufacturer || "",
            supplier: data.supplier || "",
            category: data.category || "",
            location: data.location || "",
            quantity: data.quantity ?? 0, // Handle cases where quantity is null or undefined
            low_stock_threshold: data.low_stock_threshold ?? 0, // Handle null or undefined
            productImage: data.productImage || "",
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsFetching(false); // Set fetching to false after data is loaded
      }
    };

    if (id) fetchProduct(); // Fetch product when component mounts
  }, [id]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]:
        id === "quantity" || id === "low_stock_threshold"
          ? Number(value)
          : value,
    }));
  };

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true); // Start loading
    setMessage(""); // Clear any previous messages

    try {
      let imageUrl = existingImage || ""; // Set image URL

      // If there's a new file, upload it to Firebase
      if (files[0]) {
        imageUrl = (await uploadImageToFirebase(files[0])) || imageUrl;
      }

      // Prepare form data, including the image URL
      const formData = {
        ...formValues,
        productImage: imageUrl,
      };

      // Make the PUT request to update the inventory item
      const response = await axios.put(`/api/inventory/edit/${id}`, formData);

      if (response.status !== 200) {
        throw new Error("Failed to update inventory item");
      }

      setMessage("Product updated successfully");

      // Wait for confirmation before redirecting
      setTimeout(() => {
        router.push("/inventory"); // Redirect to inventory list after successful edit
      }, 1500); // Delay redirection to allow user feedback
    } catch (error: any) {
      setMessage(`Error updating item: ${error.message}`);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Handle new file upload
  const handleFileUpload = (selectedFiles: File[]) => {
    setFiles(selectedFiles); // Save selected files to the state
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="w-full max-w-lg p-6">
        <CardHeader>
          <MainTitle>Edit Inventory Item</MainTitle>
        </CardHeader>
        <CardBody>
          {/* Show loading spinner if data is being fetched */}
          {isFetching ? (
            <div className="flex justify-center items-center">
              <Spinner label="Loading..." />
            </div>
          ) : (
            // Form for editing inventory items
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <Input
                  id="name"
                  label="Product Name"
                  value={formValues.name}
                  onChange={handleInputChange}
                  isDisabled={isFetching || isLoading} // Disable input during loading or fetching
                />
              </div>

              <div>
                <Input
                  id="product_code"
                  label="Product Code"
                  value={formValues.product_code}
                  onChange={handleInputChange}
                  isDisabled={isFetching || isLoading}
                />
              </div>

              <div>
                <Input
                  id="description"
                  label="Description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  isDisabled={isFetching || isLoading}
                />
              </div>

              <div>
                <Input
                  id="manufacturer"
                  label="Manufacturer"
                  value={formValues.manufacturer}
                  onChange={handleInputChange}
                  isDisabled={isFetching || isLoading}
                />
              </div>

              <div>
                <Input
                  id="supplier"
                  label="Supplier"
                  value={formValues.supplier}
                  onChange={handleInputChange}
                  isDisabled={isFetching || isLoading}
                />
              </div>

              <div>
                <Input
                  id="category"
                  label="Category"
                  value={formValues.category}
                  onChange={handleInputChange}
                  isDisabled={isFetching || isLoading}
                />
              </div>

              <div>
                <Input
                  id="location"
                  label="Location"
                  value={formValues.location}
                  onChange={handleInputChange}
                  isDisabled={isFetching || isLoading}
                />
              </div>

              <div>
                <Input
                  id="quantity"
                  type="number"
                  label="Quantity"
                  value={String(formValues.quantity)} // Convert number to string
                  onChange={handleInputChange}
                  isDisabled={isFetching || isLoading}
                />
              </div>

              <div>
                <Input
                  id="low_stock_threshold"
                  type="number"
                  label="Low Stock Threshold"
                  value={String(formValues.low_stock_threshold)} // Convert number to string
                  onChange={handleInputChange}
                  isDisabled={isFetching || isLoading}
                />
              </div>

              {/* File Upload with Lens Feature */}
              <div className="flex flex-col gap-3 justify-center items-center">
                <label>Product Image</label>
                {existingImage && (
                  <Lens hovering={hovering} setHovering={setHovering}>
                    <Image
                      src={existingImage}
                      alt="Existing product"
                      className="h-40 w-40 object-cover rounded-lg"
                      width={160}
                      height={160}
                    />
                  </Lens>
                )}
                <FileUpload onChange={handleFileUpload} />
              </div>

              <Button type="submit" isLoading={isLoading} isDisabled={isFetching}>
                Update Item
              </Button>
            </form>
          )}
        </CardBody>
        <CardFooter>
          {message && (
            <p
              className={
                message.includes("successfully") ? "text-success" : "text-danger"
              }
            >
              {message}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditInventoryItems;
