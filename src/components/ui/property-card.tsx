"use client";

import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${property.type}/${property.id}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="aspect-w-16 aspect-h-9 relative">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {property.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{property.location}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-bold text-indigo-600">
              {formatCurrency(property.price)}
            </p>
            <div className="flex space-x-2 text-sm text-gray-500">
              <span>{property.bedrooms} beds</span>
              <span>•</span>
              <span>{property.bathrooms} baths</span>
              <span>•</span>
              <span>{property.area} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
