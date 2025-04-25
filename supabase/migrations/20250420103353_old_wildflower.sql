/*
  # Initial Schema Setup for PropertyConnect

  1. New Tables
    - `users` - Extended user profile data
      - `id` (uuid, primary key, matches auth.users)
      - `full_name` (text)
      - `role` (enum: client, landlord, broker, admin)
      - `phone` (text)
      - `avatar_url` (text)
      - `verified` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `currency` (text)
      - `location` (text)
      - `coordinates` (point)
      - `type` (enum: rent, sale)
      - `property_type` (enum: apartment, house, land, commercial, office)
      - `bedrooms` (int)
      - `bathrooms` (int)
      - `area` (numeric)
      - `features` (text[])
      - `images` (text[])
      - `verified` (boolean)
      - `featured` (boolean)
      - `owner_id` (uuid, references users)
      - `broker_id` (uuid, references users, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `saved_properties`
      - `user_id` (uuid, references users)
      - `property_id` (uuid, references properties)
      - `created_at` (timestamp)

    - `property_views`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `user_id` (uuid, references users)
      - `viewed_at` (timestamp)

    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references users)
      - `receiver_id` (uuid, references users)
      - `property_id` (uuid, references properties)
      - `content` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'landlord', 'broker', 'admin');
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'land', 'commercial', 'office');
CREATE TYPE property_purpose AS ENUM ('rent', 'sale');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  phone text,
  avatar_url text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  currency text DEFAULT 'UGX',
  location text NOT NULL,
  coordinates point,
  type property_purpose NOT NULL,
  property_type property_type NOT NULL,
  bedrooms int,
  bathrooms int,
  area numeric,
  features text[],
  images text[],
  verified boolean DEFAULT false,
  featured boolean DEFAULT false,
  owner_id uuid REFERENCES users NOT NULL,
  broker_id uuid REFERENCES users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_properties table
CREATE TABLE IF NOT EXISTS saved_properties (
  user_id uuid REFERENCES users NOT NULL,
  property_id uuid REFERENCES properties NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, property_id)
);

-- Create property_views table
CREATE TABLE IF NOT EXISTS property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties NOT NULL,
  user_id uuid REFERENCES users NOT NULL,
  viewed_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users NOT NULL,
  receiver_id uuid REFERENCES users NOT NULL,
  property_id uuid REFERENCES properties NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Properties policies
CREATE POLICY "Anyone can view verified properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (verified = true);

CREATE POLICY "Owners can manage their properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Brokers can manage assigned properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (auth.uid() = broker_id);

CREATE POLICY "Admins can manage all properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  ));

-- Saved properties policies
CREATE POLICY "Users can manage their saved properties"
  ON saved_properties
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Property views policies
CREATE POLICY "Users can view their own property views"
  ON property_views
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create property views"
  ON property_views
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can manage their own messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (sender_id, receiver_id));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();