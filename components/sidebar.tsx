"use client";

import { useState } from "react";
import { useToggleMenu } from "@/context/toggleMenuContext";
import { usePathname } from "next/navigation";

import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Tooltip } from "@nextui-org/tooltip";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

import { linksData } from "@/config/navigationLinks";
import Image from "next/image";
import logo from "../public/logo.svg";
import logo_sm from "../public/logo_sm.svg";
import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs";

import { useSession } from "next-auth/react";

const Sidebar = () => {
  const pathName = usePathname();
  const { isMenuOpen, handleToggleMenu } = useToggleMenu();
  const [isActiveLink, setIsActiveLink] = useState(pathName);
  const { data: session } = useSession();

  const iconSize = 20;

  const handleActiveLink = (link: string) => {
    setIsActiveLink(link);
    console.log(pathName);
    console.log(link);
  };

  /*   const linksUser = session?.user. */

  return (
    <aside
      className={`sidebar border-r border-divider shadow-2xl grid grid-rows-[64px_1fr] transition-all duration-200 ${isMenuOpen ? "md:w-44 lg:w-64 px-4" : "w-auto px-0"}`}
    >
      <div className="flex items-center justify-between">
        <Button
          variant="light"
          isIconOnly= {isMenuOpen ? false : true}
          disableRipple
          as={Link}
          href="/dashboard"
          onPress={() => handleActiveLink(pathName)
          }
        >
          <Image
            src={isMenuOpen ? logo : logo_sm}
            width={isMenuOpen ? 150 : 30}
            alt="Motherson Company Logo"
            className="transition-all duration-150"
          />
        </Button>

        <Button
          variant="solid"
          isIconOnly
          size="sm"
          className="transition-transform"
          onClick={handleToggleMenu}
        >
          {isMenuOpen ? (
            <BsArrowBarLeft size={iconSize} />
          ) : (
            <BsArrowBarRight size={iconSize} />
          )}
        </Button>
      </div>

      <ul className={`flex flex-col gap-2 w-full row-start-2 mt-14`}>
        {linksData.map(({ text, icon: Icon, iconSize, href, subLinks }) =>
          subLinks ? (
            isMenuOpen ? (
              <Accordion
                key={text}
                itemClasses={{
                  base: `rounded-lg ${!isMenuOpen && "justify-center"}`,
                  title: `{text-2xl}`,
                }}
              >
                <AccordionItem
                  title={isMenuOpen && text}
                  isCompact
                  startContent={<Icon size={iconSize} />}
                  classNames={{
                    startContent: `flex justify-center`,
                  }}
                >
                  <ul className="flex flex-col gap-2">
                    {subLinks.map(({ text, icon: Icon, href }) => (
                      <Button
                        key={href}
                        as={Link}
                        variant="light"
                        href={href}
                        isIconOnly={!isMenuOpen && true}
                        startContent={<Icon size={iconSize} />}
                        className={`data-[hover=true]:bg-indigo-100 data-[hover=true]:text-slate-800 ${isActiveLink === href ? "bg-indigo-400 text-white font-semibold" : ""} 
                        ${isMenuOpen ? "flex justify-start" : "self-center"} px-4 py-2`}
                        onPress={() => handleActiveLink(href)}
                      >
                        {text}
                      </Button>
                    ))}
                  </ul>
                </AccordionItem>
              </Accordion>
            ) : (
              <Tooltip key={text} content={text} placement="right">
                <Accordion
                  showDivider={false}
                  itemClasses={{
                    base: `rounded-lg px-2 ${!isMenuOpen && "justify-center"}`,
                    title: "text-sm",
                    startContent: `${!isMenuOpen && "self-center"}`,
                  }}
                >
                  <AccordionItem
                    title={isMenuOpen && text}
                    isCompact
                    startContent={<Icon size={iconSize} />}
                  >
                    <ul className="flex flex-col gap-2">
                      {subLinks.map(({ text, icon: Icon, href }) => (
                        <Tooltip content={text} placement="right">
                          <Button
                            key={href}
                            as={Link}
                            variant="light"
                            href={href}
                            isIconOnly={!isMenuOpen && true}
                            className={`data-[hover=true]:bg-indigo-100 data-[hover=true]:text-slate-800 ${isActiveLink === href ? "bg-indigo-400 text-white font-semibold" : ""} 
            ${isMenuOpen ? "flex justify-start" : "self-center"} px-4 py-2`}
                            onPress={() => handleActiveLink(href)}
                          >
                            <li className="flex gap-4">
                              <Icon size={iconSize} />
                              {isMenuOpen && <span>{text}</span>}
                            </li>
                          </Button>
                        </Tooltip>
                      ))}
                    </ul>
                  </AccordionItem>
                </Accordion>
              </Tooltip>
            )
          ) : isMenuOpen ? (
            <Button
              as={Link}
              variant={isActiveLink === href ? "shadow" : "light"}
              isIconOnly={!isMenuOpen && true}
              href={href}
              onPress={() => handleActiveLink(href)}
              className={`data-[hover=true]:bg-indigo-100 data-[hover=true]:text-slate-800 ${isActiveLink === href ? "bg-indigo-400 text-white font-semibold" : ""} 
            ${isMenuOpen ? "flex justify-start" : "self-center"} px-4 py-2`}
            >
              <li className="flex gap-4">
                <Icon size={iconSize} /> {isMenuOpen && <span>{text}</span>}
              </li>
            </Button>
          ) : (
            <Tooltip content={text} placement="right">
              <Button
                as={Link}
                variant={isActiveLink === href ? "shadow" : "light"}
                isIconOnly={!isMenuOpen && true}
                href={href}
                onPress={() => handleActiveLink(href)}
                className={`data-[hover=true]:bg-indigo-100 data-[hover=true]:text-slate-800 ${isActiveLink === href ? "bg-indigo-400 text-white font-semibold" : ""} 
            ${isMenuOpen ? "flex justify-start" : "self-center"} px-4 py-2`}
              >
                <li className="flex gap-4">
                  <Icon size={iconSize} /> {isMenuOpen && <span>{text}</span>}
                </li>
              </Button>
            </Tooltip>
          )
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
