"use client";

import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { usePathname } from "next/navigation";
import { linksData } from "@/config/navigationLinks";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useToggleMenu } from "@/context/toggleMenuContext";

import Image from "next/image";
import logo from "@/public/logo.svg";
import { BreadcrumbReusable } from "./breadCrumbReusable";
import { Skeleton } from "@nextui-org/skeleton";
import { Session } from "next-auth";



export default function NavComponent() {
  const { data: session, status } = useSession();
  const { isMenuOpen } = useToggleMenu();

  const userMenu = session ? (
    <NavbarContent as="div" justify="end">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="primary"
            name={session.user?.name as string}
            size="sm"
            src={"https://api.dicebear.com/9.x/adventurer/svg?seed=Max"}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="shadow">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold"> {session?.user?.name} </p>
          </DropdownItem>
          <DropdownItem key="settings">Account Settings</DropdownItem>
          <DropdownItem key="my-stats">My Stats</DropdownItem>
          <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  ) : (
    <NavbarContent justify="end">
      <NavbarItem>
        {status === "loading" ? (
          <Skeleton className="w-12 h-12 rounded-full" />
        ) : (
          <Button
            as={Link}
            color="primary"
            href="/api/auth/signin"
            variant="shadow"
          >
            Sign in
          </Button>
        )}
      </NavbarItem>
    </NavbarContent>
  );

  return (
    <div className="col-start-2 row-start-1 flex justify-start items-center">
      <div className="px-3 border-b border-divider h-full md:flex items-center hidden"></div>
      <Navbar isBordered isBlurred className="navbar">
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className=" md:hidden"
          />
          <NavbarBrand>
            <Link href="/">
              <Image
                src={logo}
                alt="Motherson Company Logo"
                className="md:hidden ml-2"
                width={120}
              />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        {/* Breadcrumbs*/}

        <BreadcrumbReusable className="hidden lg:block" />

        {userMenu}

        <NavbarMenu className="px-24 mt-9">
          {linksData.map(({ text, href, icon: Icon, iconSize, subLinks }) =>
            subLinks ? (
              <NavbarMenuItem key={href}>
                {
                  <Accordion>
                    <AccordionItem key={href} title={text}>
                      {subLinks.map(({ href, text }) => (
                        <Link
                          key={href}
                          href={href}
                          className="flex justify-start items-center gap-4"
                        >
                          <span className="font-bold text-lg"> {text} </span>
                        </Link>
                      ))}
                    </AccordionItem>
                  </Accordion>
                }
              </NavbarMenuItem>
            ) : (
              <Link key={href} href={href}>
                <span> {text} </span>
              </Link>
            )
          )}
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
