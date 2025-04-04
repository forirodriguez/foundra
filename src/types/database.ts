export type PropertyType = "sale" | "rent" | "development";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  property_id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  visit_type: "in-person" | "video-call";
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}
