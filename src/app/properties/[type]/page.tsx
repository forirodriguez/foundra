import { supabase } from "@/lib/supabase/client";
import MainLayout from "@/components/layout/main-layout";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

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
    <Link href={`/properties/${property.type}/${property.id}`}>
      <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg">
        <div className="relative aspect-w-16 aspect-h-9">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {property.title}
          </h3>
          <p className="mt-1 text-xl font-bold text-indigo-600">
            {formatCurrency(property.price)}
          </p>
          <p className="mt-1 text-sm text-gray-500">{property.location}</p>
          <div className="mt-2 flex space-x-4 text-sm text-gray-500">
            <span>{property.bedrooms} beds</span>
            <span>•</span>
            <span>{property.bathrooms} baths</span>
            <span>•</span>
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

async function getProperties(type: string) {
  try {
    const { data: properties, error } = await supabase
      .from("properties")
      .select("*")
      .eq("type", type);

    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }

    return properties || [];
  } catch (error) {
    console.error("Error in getProperties:", error);
    return [];
  }
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </MainLayout>
  );
}
