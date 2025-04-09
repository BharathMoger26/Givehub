import type { Metadata } from "next";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import ThemeProvider from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutProvider from "@/providers/layout-providers";

export const metadata: Metadata = {
  title: "Givehub: A Hub for Giving",
  description:
    "A platform to empower giving and make social impact accessible.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className="min-h-screen w-full bg-background text-foreground antialiased font-sans">
          <ThemeProvider>
            <LayoutProvider>
              <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-10 lg:py-12">
                {children}
              </main>
            </LayoutProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
