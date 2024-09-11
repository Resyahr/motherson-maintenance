"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Spinner } from "@nextui-org/spinner";
import MainTitle from "@/components/mainTitle";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Lens } from "@/components/ui/lens"; // Import Lens component
import Image from "next/image"; // Use Next.js Image for better performance
import { motion } from "framer-motion"; // Framer motion for animation

const ItemDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get the 'id' query parameter
  const [item, setItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hovering, setHovering] = useState(false); // Hover state for Lens

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`/api/inventory/details?id=${id}`);
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchItemDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner label="Loading Item Details..." />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center">
        <p>Item not found</p>
      </div>
    );
  }

  const stockStatus =
    item.quantity < item.low_stock_threshold ? "Low Stock" : "In Stock";

  return (
    <div className="p-6 container mx-auto">
      <MainTitle>{item.name}</MainTitle>
      <Card className="shadow-lg max-w-4xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <h3 className="text-xl font-semibold">{item.name}</h3>
        </CardHeader>

        <CardBody className="flex flex-col md:flex-row gap-8">
          {/* Product Image with Lens Effect */}
          <div className="flex justify-center items-center md:w-1/3">
            <Lens hovering={hovering} setHovering={setHovering}>
              <motion.div
                animate={{
                  filter: hovering ? "blur(2px)" : "blur(0px)",
                }}
              >
                <Image
                  src={item.productImage || "https://via.placeholder.com/300"}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="rounded-lg shadow-lg"
                  objectFit="cover"
                />
              </motion.div>
            </Lens>
          </div>

          {/* Product Details */}
          <div className="md:w-2/3 space-y-4">
            <p>
              <strong>Category:</strong> {item.category}
            </p>
            <p>
              <strong>Description:</strong>
              {item.description || "No description available"}
            </p>
            <p>
              <strong>Quantity:</strong> {item.quantity}
            </p>
            <p>
              <strong>Stock Threshold:</strong> {item.low_stock_threshold}
            </p>
            <p>
              <strong>Stock Status:</strong>
              <Chip
                color={
                  item.quantity < item.low_stock_threshold
                    ? "danger"
                    : "success"
                }
              >
                {stockStatus}
              </Chip>
            </p>
          </div>
        </CardBody>

        <CardFooter className="flex justify-end">
          <Button color="secondary" variant="flat" className="mr-2">
            Edit
          </Button>
          <Button color="danger" variant="flat">
            Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ItemDetails;
