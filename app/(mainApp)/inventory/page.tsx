"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import { Chip } from "@nextui-org/chip";
import {
  MdOutlineDelete,
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { useAsyncList } from "@react-stately/data";
import MainTitle from "@/components/mainTitle";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { IProducts } from "@/lib/schemas/productSchema";

// Helper function to truncate text
const truncateText = (str: string, maxLength: number = 30) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
};

// Helper function to return predefined color types and messages
const getChipMessage = (quantity: number, lowStockThreshold: number) => {
  if (quantity < lowStockThreshold)
    return { message: "Low Stock", color: "danger" as const }; // Below threshold
  if (quantity === lowStockThreshold)
    return { message: "Restock Soon", color: "warning" as const }; // Exactly at threshold
  return { message: "Sufficient Stock", color: "success" as const }; // Above threshold
};

const Inventory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<IProducts | null>(
    null
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter(); // Using Next.js router

  // Using useAsyncList to load and sort the inventory
  const list = useAsyncList<IProducts>({
    async load({ signal }) {
      setIsLoading(true);
      const response = await axios.get("/api/inventory", { signal });
      setIsLoading(false);

      return {
        items: response.data,
      };
    },
    async sort({ items, sortDescriptor }) {
      const { column, direction } = sortDescriptor;
      return {
        items: items.sort((a, b) => {
          let first = a[column as keyof IProducts];
          let second = b[column as keyof IProducts];

          // Handle numeric and string comparison
          let cmp =
            typeof first === "number" && typeof second === "number"
              ? first - second
              : String(first).localeCompare(String(second));

          return direction === "descending" ? -cmp : cmp;
        }),
      };
    },
  });

  // Function to render table cells
  const renderCell = (item: IProducts, columnKey: React.Key) => {
    let value = item[columnKey as keyof IProducts];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            {isLoading ? (
              <Spinner />
            ) : (
              <Image
                src={item.productImage || "https://via.placeholder.com/60"}
                alt={item.name}
                className="rounded-md w-12 h-12"
              />
            )}
            <div className="flex flex-col">
              <span className="font-bold text-lg">{item.name}</span>
              <span className="text-sm text-neutral-500 dark:text-neutral-300">
                {truncateText(
                  item.description || "No description available",
                  50
                )}
              </span>
            </div>
          </div>
        );
      case "category":
        return <span>{item.category}</span>;
      case "quantity":
        return <span>{item.quantity}</span>;
      case "stock":
        const { message, color } = getChipMessage(
          item.quantity,
          item.low_stock_threshold
        );
        return <Chip color={color}>{message}</Chip>;
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {/* View Item */}
            <Tooltip content="View Item">
              <Button
                isIconOnly
                variant="light"
                onPress={() => router.push(`/inventory/details?id=${item._id}`)}
              >
                <MdOutlineRemoveRedEye className="text-lg text-default-400 cursor-pointer active:opacity-50" />
              </Button>
            </Tooltip>

            {/* Edit Item */}
            <Tooltip content="Edit Item">
              <Button
                isIconOnly
                variant="light"
                onPress={() => router.push(`/inventory/edit/${item._id}`)}
              >
                <MdOutlineEdit className="text-lg text-default-400 cursor-pointer active:opacity-50" />
              </Button>
            </Tooltip>

            {/* Delete Item */}
            <Tooltip color="danger" content="Delete Item">
              <Button
                isIconOnly
                variant="light"
                onPress={() => {
                  setSelectedProduct(item);
                  onOpen();
                }}
              >
                <MdOutlineDelete className="text-lg text-danger cursor-pointer active:opacity-50" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return <span>{String(value)}</span>; // Ensure proper conversion to string for rendering
    }
  };

  // Handle deleting product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await axios.delete("/api/inventory/delete", {
        data: { id: selectedProduct._id },
      });
      setIsLoading(true);
      list.reload(); // Reload inventory after deletion
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      onOpenChange(); // Close modal
      setIsLoading(false);
    }
  };

  return (
    <>
      <MainTitle>Inventory</MainTitle>

      <Table
        aria-label="Inventory Table with Sorting and Stock Chips"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
      >
        <TableHeader>
          <TableColumn key="name" allowsSorting>
            Name
          </TableColumn>
          <TableColumn key="category" allowsSorting>
            Category
          </TableColumn>
          <TableColumn key="quantity" allowsSorting>
            Quantity
          </TableColumn>
          <TableColumn key="stock">Stock Status</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody
          items={list.items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell key={columnKey.toString()}>
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal for confirming deletion */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>z
              <ModalBody>
                <p>Are you sure you want to delete the product?</p>
                <p className="font-bold text-danger">{selectedProduct?.name}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={handleDeleteProduct}>
                  Delete
                </Button>
                <Button onPress={onClose}>Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Inventory;
