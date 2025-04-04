# Foundra - Modern Real Estate SaaS Platform

A modern real estate platform built with Next.js, Supabase, and TypeScript.

## Features

- Property listings (For Sale, For Rent, Development Projects)
- Detailed property pages with image galleries
- Booking system for property viewings
- Admin dashboard for property and booking management
- Responsive design with Tailwind CSS
- Type-safe development with TypeScript
- Server-side rendering with Next.js
- Real-time updates with Supabase

## Tech Stack

- **Frontend:**

  - Next.js 14 with App Router
  - React Query for data fetching
  - TypeScript for type safety
  - Tailwind CSS for styling
  - React Hook Form for form handling
  - Zod for schema validation

- **Backend:**
  - Supabase for backend services
  - PostgreSQL database
  - Supabase Auth for authentication
  - Supabase Storage for image storage

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/foundra.git
   cd foundra
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.local.example` to `.env.local`
   - Update the Supabase configuration with your project credentials

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)

2. Create the following tables in your Supabase database:

   ```sql
   -- Properties table
   create table properties (
     id uuid default uuid_generate_v4() primary key,
     title text not null,
     description text not null,
     price numeric not null,
     type text not null check (type in ('sale', 'rent', 'development')),
     location text not null,
     bedrooms integer not null,
     bathrooms integer not null,
     area numeric not null,
     images text[] not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Bookings table
   create table bookings (
     id uuid default uuid_generate_v4() primary key,
     property_id uuid references properties(id) not null,
     name text not null,
     email text not null,
     phone text not null,
     preferred_date date not null,
     preferred_time time not null,
     visit_type text not null check (visit_type in ('in-person', 'video-call')),
     status text not null check (status in ('pending', 'confirmed', 'cancelled')),
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Users table
   create table users (
     id uuid references auth.users on delete cascade primary key,
     email text not null,
     role text not null check (role in ('admin', 'user')),
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

3. Set up Row Level Security (RLS) policies for your tables:

   ```sql
   -- Properties table policies
   alter table properties enable row level security;
   create policy "Properties are viewable by everyone" on properties
     for select using (true);
   create policy "Properties are editable by admins" on properties
     for all using (auth.uid() in (select id from users where role = 'admin'));

   -- Bookings table policies
   alter table bookings enable row level security;
   create policy "Bookings are viewable by admins" on bookings
     for select using (auth.uid() in (select id from users where role = 'admin'));
   create policy "Bookings are insertable by everyone" on bookings
     for insert with check (true);
   create policy "Bookings are editable by admins" on bookings
     for update using (auth.uid() in (select id from users where role = 'admin'));

   -- Users table policies
   alter table users enable row level security;
   create policy "Users are viewable by admins" on users
     for select using (auth.uid() in (select id from users where role = 'admin'));
   create policy "Users are editable by admins" on users
     for all using (auth.uid() in (select id from users where role = 'admin'));
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
