"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { useUser } from "@/contexts/user-context";
import {
  HomeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Properties",
    href: "/dashboard/properties",
    icon: BuildingOfficeIcon,
  },
  { name: "Bookings", href: "/dashboard/bookings", icon: CalendarIcon },
  { name: "Users", href: "/dashboard/users", icon: UsersIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { signOut } = useUser();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
          >
            <div className="flex h-16 items-center justify-between px-4">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-gray-900"
              >
                Foundra Admin
              </Link>
              <button
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-5 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 flex-shrink-0 ${
                        isActive ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
              <button
                onClick={signOut}
                className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400" />
                Sign out
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <header className="bg-white shadow">
              <div className="px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  {navigation.find((item) => item.href === pathname)?.name ||
                    "Dashboard"}
                </h1>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
