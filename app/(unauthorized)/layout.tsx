import "@/styles/globals.css";
import { clsx } from "clsx";
import { NextAuthProvider } from "@/utils/authProvider";
import { fontSans } from "@/config/fonts";
import { Providers } from "@/app/providers";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={clsx(
          "min-h-screen font-sans antialiased dark text-foreground bg-background ",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <NextAuthProvider>
            <main>{children}</main>
          </NextAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
