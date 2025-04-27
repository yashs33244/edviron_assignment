import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/ui/navigation";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Edviron Payment System",
  description: "Process and manage payments for your school",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col bg-background">
              <header className="border-b bg-card">
                <div className="container flex h-16 items-center justify-between">
                  <div className="font-bold text-lg">
                    Edviron Payment System
                  </div>
                  <Navigation />
                </div>
              </header>
              <main className="flex-1 container py-6">{children}</main>
              <footer className="border-t py-4">
                <div className="container text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Edviron. All rights reserved.
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
