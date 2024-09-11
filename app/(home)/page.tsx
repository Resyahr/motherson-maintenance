"use client";

import { useSession } from "next-auth/react";
import MainTitle from "@/components/mainTitle";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleViewInventory = () => {
    router.push("/inventory");
  };

  return (
    <div className="flex flex-col justify-center items-center px-4">
      <MainTitle>Welcome back {session?.user.name}!</MainTitle>

      <Card className="w-full max-w-2xl my-10">
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            Welcome to your Maintenance Technician's Dashboard
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-lg mb-4">
            This app is designed to help you track and manage your inventory in
            real-time. Easily monitor product quantities and stay updated when
            items need to be restocked.
          </p>
          <p className="text-lg mb-4">
            <strong>What's next?</strong> Our platform is scalable and
            customizable. In the near future, we plan to add exciting features
            like:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Instant access to maintenance documentation</li>
            <li>Task management for tracking your completed tasks</li>
            <li>Improved inventory tracking with automated alerts</li>
            <li>More features and integrations to come...</li>
          </ul>
          <p className="text-lg">
            Stay tuned for continuous improvements and new functionalities to
            simplify your work!
          </p>
          <div className="mt-6 flex justify-center">
            <Button onPress={handleViewInventory} color="primary">
              View Inventory
            </Button>
          </div>
        </CardBody>
      </Card>

      <footer className="mt-10 text-center">
        <p className="text-sm text-neutral-400">
          Made with 💖 by Rhayser Montoya 2024
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
