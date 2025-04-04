import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { UserProvider } from "@/contexts/user-context";
import UserStatus from "@/components/user-status";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Foundra - Modern Real Estate Platform",
  description:
    "Find your perfect property with Foundra - Modern Real Estate Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <UserProvider>
            <div className="min-h-screen bg-gray-50">
              <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-gray-900">
                      Foundra
                    </Link>
                    <UserStatus />
                  </div>
                </div>
              </header>
              <main>{children}</main>
            </div>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
