export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Instandhaltung App",
  description: "",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Inventory",
      href: "/inventory",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
};
