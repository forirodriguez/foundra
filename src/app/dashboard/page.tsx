"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

interface Stats {
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
}

interface RecentBooking {
  id: string;
  property_id: string;
  name: string;
  email: string;
  preferred_date: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total properties
        const { count: propertiesCount } = await supabase
          .from("properties")
          .select("*", { count: "exact", head: true });

        // Fetch total bookings
        const { count: bookingsCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });

        // Fetch total users
        const { count: usersCount } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true });

        // Fetch recent bookings
        const { data: bookings } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalProperties: propertiesCount || 0,
          totalBookings: bookingsCount || 0,
          totalRevenue: 0, // This would need to be calculated based on your business logic
          totalUsers: usersCount || 0,
        });

        setRecentBookings(bookings || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BuildingOfficeIcon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Properties
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalProperties}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Bookings
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalBookings}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Revenue
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  ${stats.totalRevenue.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Total Users
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalUsers}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
          <div className="mt-6 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {booking.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {booking.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(
                            booking.preferred_date
                          ).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
