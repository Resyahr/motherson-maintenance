//Next
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { roboto } from "@/config/fonts";

import clsx from "clsx";

//Providers
import { Providers } from "../providers";
import { NextAuthProvider } from "@/utils/authProvider";

//Components
import NavComponent from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import ToggleMenuProvider from "@/context/toggleMenuContext";
import { BreadcrumbReusable } from "@/components/breadCrumbReusable";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  /* icons: {
    icon: "/favicon.ico",
  }, */
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <NextAuthProvider>
        <body
          className={clsx(
            "min-h-screen font-sans antialiased dark text-foreground bg-background ",
            fontSans.variable
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <ToggleMenuProvider>
              <div className={`wrapper`}>
                <NavComponent />
                <Sidebar />
                <main className="main-content md:overflow-auto px-4 md:px-10 lg:px-20 py-14 ">
                  <BreadcrumbReusable className="lg:hidden mb-10" />
                  {children}
                </main>
              </div>
            </ToggleMenuProvider>

            {/* <footer>
              <p>Footer</p>
            </footer> */}
          </Providers>
        </body>
      </NextAuthProvider>
    </html>
  );
}
