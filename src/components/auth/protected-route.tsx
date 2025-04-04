"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.push("/auth/login");
        return;
      }

      // Check if user has admin role
      const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!user || user.role !== "admin") {
        router.push("/");
        return;
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
