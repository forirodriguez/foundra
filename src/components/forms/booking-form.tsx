"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  preferred_date: z.string().min(1, "Please select a preferred date"),
  preferred_time: z.string().min(1, "Please select a preferred time"),
  visit_type: z.enum(["in-person", "video-call"]),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  propertyId: string;
}

export default function BookingForm({ propertyId }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase.from("bookings").insert([
        {
          property_id: propertyId,
          ...data,
          status: "pending",
        },
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      setSubmitError(`${error}: Failed to submit booking. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          {...register("phone")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="preferred_date"
          className="block text-sm font-medium text-gray-700"
        >
          Preferred Date
        </label>
        <input
          type="date"
          id="preferred_date"
          {...register("preferred_date")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.preferred_date && (
          <p className="mt-1 text-sm text-red-600">
            {errors.preferred_date.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="preferred_time"
          className="block text-sm font-medium text-gray-700"
        >
          Preferred Time
        </label>
        <input
          type="time"
          id="preferred_time"
          {...register("preferred_time")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.preferred_time && (
          <p className="mt-1 text-sm text-red-600">
            {errors.preferred_time.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="visit_type"
          className="block text-sm font-medium text-gray-700"
        >
          Visit Type
        </label>
        <select
          id="visit_type"
          {...register("visit_type")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="in-person">In-person Visit</option>
          <option value="video-call">Video Call</option>
        </select>
        {errors.visit_type && (
          <p className="mt-1 text-sm text-red-600">
            {errors.visit_type.message}
          </p>
        )}
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      {submitSuccess && (
        <p className="text-sm text-green-600">
          Booking request submitted successfully!
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Book Viewing"}
      </button>
    </form>
  );
}
