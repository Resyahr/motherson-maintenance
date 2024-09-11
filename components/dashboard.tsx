"use client";

import React from "react";
import MainTitle from "@/components/mainTitle";
import { Button } from "@nextui-org/button";
import { FaUsers, FaBox, FaPlusCircle } from "react-icons/fa"; // Icons for stats
import { useRouter } from "next/navigation";

// Static Dashboard component
const Dashboard = () => {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Main title */}
      <MainTitle>Dashboard</MainTitle>

      {/* Section for quick actions */}
      <section className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Users Section */}
        <div
          className="flex flex-col items-center bg-slate-900 p-6 rounded-lg shadow-md hover:bg-slate-800 transition duration-300 w-full sm:w-1/3 cursor-pointer"
          onClick={() => router.push("/usersMgmt/list")}
        >
          <FaUsers className="text-4xl text-blue-500 mb-4" />
          <h2 className="text-lg font-bold">Manage Users</h2>
          <p className="text-gray-400">View and manage all users</p>
        </div>

        {/* Inventory Section */}
        <div
          className="flex flex-col items-center bg-slate-900 p-6 rounded-lg shadow-md hover:bg-slate-800 transition duration-300 w-full sm:w-1/3 cursor-pointer"
          onClick={() => router.push("/inventory")}
        >
          <FaBox className="text-4xl text-green-500 mb-4" />
          <h2 className="text-lg font-bold">Inventory</h2>
          <p className="text-gray-400">Track and manage inventory</p>
        </div>

        {/* Create New Section */}
        <div
          className="flex flex-col items-center bg-slate-900 p-6 rounded-lg shadow-md hover:bg-slate-800 transition duration-300 w-full sm:w-1/3 cursor-pointer"
          onClick={() => router.push("/inventory/create")}
        >
          <FaPlusCircle className="text-4xl text-pink-500 mb-4" />
          <h2 className="text-lg font-bold">Create New Product</h2>
          <p className="text-gray-400">Add a new product to the inventory</p>
        </div>
      </section>

      {/* Information / Stats Section */}
      <section className="mt-10 space-y-6">
        <div className="bg-slate-900 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-200 mb-4">
            Welcome to the Inventory Management System!
          </h3>
          <p className="text-gray-400">
            You can manage your inventory, users, and products from this
            dashboard. Select an option from the above sections to get started.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-200 mb-4">Quick Tips</h3>
          <ul className="list-disc list-inside text-gray-400">
            <li>
              Use the "Manage Users" section to add, edit, or delete users.
            </li>
            <li>
              Track your inventory efficiently from the "Inventory" section.
            </li>
            <li>
              Click "Create New Product" to add new items to your inventory.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
