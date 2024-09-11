"use client";
import { useEffect, useCallback, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { User } from "@nextui-org/user";
import { Tooltip } from "@nextui-org/tooltip";
import { Spinner } from "@nextui-org/spinner";

import { MdOutlineDelete, MdOutlineEdit, MdOutlineRemoveRedEye, MdAdd } from "react-icons/md";
import { Button } from "@nextui-org/button";
import { IUser } from "@/lib/schemas/userSchema";

import { columns } from "./data";
import Link from "next/link";
import axios from "axios";

// Helper function to format dates
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "N/A";
  if (typeof date === "string") return date;
  return date.toLocaleDateString(); // Format date as string
};

type User = IUser;

export default function UserMgmt() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get("/api/user/users");
        const res = data.data;
        setUsers(res);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const handleSelectedUser = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDeleteUser = async (user: User | null) => {
    if (selectedUser) {
      try {
        const payload = await axios.delete("/api/user/delete", {
          data: { id: user?._id },
        });
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== selectedUser._id)
        );
      } catch (error) {
        console.log(error);
      } finally {
        onOpenChange();
      }
    }
  };

  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "name":
        return (
          <User description={user.email} name={cellValue as string}>
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue as string}</p>
          </div>
        );
      case "createdAt": // Assuming this is a date
        return <span>{formatDate(cellValue as Date | string)}</span>;
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Button isIconOnly variant="light" onPress={onOpen}>
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <MdOutlineRemoveRedEye />
                </span>
              </Tooltip>
            </Button>
            <Button isIconOnly variant="light">
              <Tooltip content="Edit user">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <MdOutlineEdit />
                </span>
              </Tooltip>
            </Button>

            <Button
              onPress={() => handleSelectedUser(user)}
              variant="light"
              className="p-0"
              isIconOnly
            >
              <Tooltip color="danger" content="Delete user">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <MdOutlineDelete />
                </span>
              </Tooltip>
            </Button>
          </div>
        );
      default:
        return cellValue ? (cellValue as string) : "N/A"; // Handle undefined values
    }
  }, []);

  return (
    <div className="flex flex-col">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Users Control Panel
      </h1>
      <Table aria-label="Example table with custom cells" className="mt-12">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={users}
          isLoading={isLoading}
          loadingContent={
            <div className="flex flex-col gap-2 justify-center items-center">
              <Spinner /> <span>Loading...</span>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader className="text-danger">Warning</ModalHeader>
              <ModalBody>
                <p className="text-danger">
                  This action cannot be undone. Please make sure you want to
                  delete this user.
                </p>
                <div className="my-6">
                  <Input type="text" label="Type user Name and Last Name" />
                  <p className="text-sm px-2 mt-2">
                    To continue, please write down
                    <span className="font-bold text-danger">
                      <span> {selectedUser?.name} </span>{" "}
                      <span> {selectedUser?.lastName} </span>
                    </span>
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => handleDeleteUser(selectedUser)}
                >
                  Delete
                </Button>
                <Button color="primary" onPress={onclose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="rounded-full self-end my-14">
        <Tooltip content="Add new user">
          <Button
            as={Link}
            href="/usersMgmt/create"
            isIconOnly
            variant="shadow"
            className="bg-indigo-400"
          >
            <MdAdd size={20} color="white" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
