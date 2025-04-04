import MainLayout from "@/components/layout/main-layout";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// Mark the page as dynamic to prevent static generation
export const dynamic = "force-dynamic";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  type: string;
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105">
      <div className="relative h-48 w-full">
        <Image
          src={property.images[0] || "/placeholder.jpg"}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {property.title}
        </h3>
        <p className="mt-1 text-xl font-bold text-indigo-600">
          {formatCurrency(property.price)}
        </p>
        <p className="mt-1 text-sm text-gray-500">{property.location}</p>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span>
          <span>{property.area} sq ft</span>
        </div>
      </div>
    </div>
  );
}

async function getProperties(type: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("type", type);

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return data || [];
}

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const properties = await getProperties(type);

  if (!properties.length) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold text-gray-900">
            No properties found
          </h1>
          <p className="mt-2 text-gray-600">
            There are no {type} properties available at the moment.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold capitalize">
          {type} Properties
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${type}/${property.id}`}
              className="block"
            >
              <PropertyCard property={property} />
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
