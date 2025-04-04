export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase/client";
import PropertyCard from "@/components/ui/property-card";
import MainLayout from "@/components/layout/main-layout";

async function getPropertiesForSale() {
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Properties for Sale
          </h1>
          <p className="mt-2 text-gray-600">
            Discover your dream home from our selection of premium properties
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
