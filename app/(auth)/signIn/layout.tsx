import "@/styles/globals.css";
import { clsx } from "clsx";
import { NextAuthProvider } from "@/utils/authProvider";
import { fontSans } from "@/config/fonts";
import { Providers } from "@/app/providers";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

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
            <main>
              <BackgroundBeamsWithCollision className="h-screen min-h-screen">
                {children}
              </BackgroundBeamsWithCollision>
            </main>
          </NextAuthProvider>
        </Providers>
      </body>
    </html>
  );
}
