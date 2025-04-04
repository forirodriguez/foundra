import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import MainLayout from "@/components/layout/main-layout";
import BookingForm from "@/components/forms/booking-form";
import { formatCurrency } from "@/lib/utils";

async function getProperty(id: string) {
  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    return null;
  }

  return property;
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="relative aspect-w-16 aspect-h-9">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {property.title}
              </h1>
              <p className="mt-2 text-xl text-indigo-600">
                {formatCurrency(property.price)}
              </p>
            </div>

            <div className="flex space-x-4 text-sm text-gray-500">
              <span>{property.bedrooms} beds</span>
              <span>•</span>
              <span>{property.bathrooms} baths</span>
              <span>•</span>
              <span>{property.area} m²</span>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
              <p className="mt-1 text-gray-600">{property.location}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Description
              </h2>
              <p className="mt-1 text-gray-600">{property.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {property.images.slice(1).map((image: string, index: number) => (
                <div key={index} className="relative aspect-w-16 aspect-h-9">
                  <Image
                    src={image}
                    alt={`${property.title} - Image ${index + 2}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900">
                Book a Viewing
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Schedule a viewing of this property by filling out the form
                below.
              </p>
              <div className="mt-6">
                <BookingForm propertyId={property.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
