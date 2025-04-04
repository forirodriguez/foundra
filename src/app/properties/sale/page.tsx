export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import PropertyCard from "@/components/ui/property-card";
import MainLayout from "@/components/layout/main-layout";

async function getPropertiesForSale() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .eq("type", "sale")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch properties");
  }

  return properties;
}

export default async function PropertiesForSalePage() {
  const properties = await getPropertiesForSale();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Properties for Sale</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
