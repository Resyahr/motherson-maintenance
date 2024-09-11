import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdOutlineInventory2 } from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { LiaUsersCogSolid } from "react-icons/lia";
import { AiOutlineUserAdd } from "react-icons/ai";
import { PiUserList } from "react-icons/pi";
import { MdOutlineInventory } from "react-icons/md";
import { CgPlayListAdd } from "react-icons/cg";
import { LuPieChart } from "react-icons/lu";
import { IconType } from "react-icons";

export interface SubLink {
  text: string;
  href: string;
  icon: IconType;
}

export interface LinkItem {
  text: string;
  icon: IconType;
  iconSize: number;
  href: string;
  subLinks?: SubLink[];
}

type LinksData = LinkItem[];

const iconSize = 20;

const linksData: LinksData = [
  {
    text: "Dashboard",
    icon: MdOutlineSpaceDashboard,
    iconSize: iconSize,
    href: "/dashboard",
  },
  {
    text: "Inventory",
    icon: MdOutlineInventory2,
    iconSize: iconSize,
    href: "/inventory",
    subLinks: [
      {
        text: "Inventory List",
        href: "/inventory",
        icon: MdOutlineInventory,
      },
      {
        text: "Create Product",
        href: "/inventory/create",
        icon: CgPlayListAdd,
      },
      {
        text: "Stock Details",
        href: "/stockChartDetails",
        icon: LuPieChart,
      },
    ],
  },
  {
    text: "User Mgmt",
    icon: LiaUsersCogSolid,
    iconSize: iconSize,
    href: "/usersMgmt",
    subLinks: [
      { text: "Users List", href: "/usersMgmt", icon: PiUserList },
      {
        text: "Create Users",
        href: "/usersMgmt/create",
        icon: AiOutlineUserAdd,
      },
    ],
  },
];

const adminLinks = [
  {
    dashboard: {
      text: "Dashboard",
      icon: MdOutlineSpaceDashboard,
      href: "/",
    },
    inventory: {
      text: "Inventory",
      icon: MdOutlineInventory2,
      iconSize: iconSize,
      href: "/inventory",
    },
    users: {
      text: "Users panel",
      icon: IoCreateOutline,
      iconSize: iconSize,
      href: "/createUser",
    },
  },
];

export { linksData, adminLinks };


/* import {
  MdOutlineSpaceDashboard,
  MdOutlineInventory2,
  MdOutlineInventory,
} from "react-icons/md";
import { IoCreateOutline } from "react-icons/io5";
import { LiaUsersCogSolid } from "react-icons/lia";
import { AiOutlineUserAdd } from "react-icons/ai";
import { PiUserList } from "react-icons/pi";
import { CgPlayListAdd } from "react-icons/cg";
import { LuPieChart } from "react-icons/lu";
import { IconType } from "react-icons";

// Types for the structure
export interface SubLink {
  text: string;
  href: string;
  icon: IconType;
}

export interface LinkItem {
  text: string;
  icon: IconType;
  iconSize: number;
  href: string;
  subLinks?: SubLink[];
}

const iconSize = 20;

// User-level links
const userLinks: LinkItem[] = [
  {
    text: "Dashboard",
    icon: MdOutlineSpaceDashboard,
    iconSize: iconSize,
    href: "/",
  },
  {
    text: "Inventory",
    icon: MdOutlineInventory2,
    iconSize: iconSize,
    href: "/inventory",
    subLinks: [
      {
        text: "Inventory List",
        href: "/inventory",
        icon: MdOutlineInventory,
      },
      {
        text: "Create Product",
        href: "/inventory/create",
        icon: CgPlayListAdd,
      },
      {
        text: "Stock Details",
        href: "/stockChartDetails",
        icon: LuPieChart,
      },
    ],
  },
];

// Admin-level links
const adminLinks: LinkItem[] = [
  {
    text: "User Mgmt",
    icon: LiaUsersCogSolid,
    iconSize: iconSize,
    href: "/usersMgmt",
    subLinks: [
      {
        text: "Users List",
        href: "/usersMgmt",
        icon: PiUserList,
      },
      {
        text: "Create Users",
        href: "/usersMgmt/create",
        icon: AiOutlineUserAdd,
      },
    ],
  },
  {
    text: "Admin Dashboard",
    icon: IoCreateOutline,
    iconSize: iconSize,
    href: "/adminDashboard",
  },
];

// Export both sets of links
export { userLinks, adminLinks };
 */