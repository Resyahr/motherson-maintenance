"use client";

import "@/styles/globals.css";
import { NextAuthProvider } from "@/utils/authProvider";
import NavComponent from "@/components/navbar";
import ToggleMenuProvider from "@/context/toggleMenuContext";
import clsx from "clsx";
import { fontSans } from "@/config/fonts";
import { Providers } from "../providers";

export default function HomeLayout({
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
            "min-h-screen font-sans antialiased dark text-foreground bg-background",
            fontSans.variable
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <ToggleMenuProvider>
              <div className={`wrapper`}>
                {/* Navbar for global navigation */}
                <NavComponent />

                <main className="main-content md:overflow-auto px-4 md:px-10 lg:px-20 py-14">
                  {children}
                </main>
              </div>
            </ToggleMenuProvider>
          </Providers>
        </body>
      </NextAuthProvider>
    </html>
  );
}
