"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import Image from "next/image";
import logo from "@/public/logo.svg"; // Your company logo path

export default function NavComponent() {
  return (
    <Navbar isBordered className="w-full">
      {/* Navbar Brand with Logo */}
      <NavbarBrand>
        <Image src={logo} alt="Motherson Logo" width={120} />
      </NavbarBrand>

      {/* Navbar Content with Sign In button */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            href="/api/auth/signin" 
            color="primary"
            variant="flat"
          >
            Sign In
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
