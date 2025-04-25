-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table with specific user types
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    phone_number TEXT,
    email TEXT NOT NULL,
    user_type TEXT CHECK (user_type IN ('seeker', 'landlord', 'broker', 'admin')) DEFAULT 'seeker',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification requests table (only for landlords and brokers)
CREATE TABLE verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    user_type TEXT NOT NULL CHECK (user_type IN ('landlord', 'broker')),
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    -- Landlord specific fields
    property_ownership_proof_url TEXT,
    -- Broker specific fields
    business_license_url TEXT,
    certificate_of_incorporation_url TEXT,
    office_location TEXT,
    business_photo_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id),
    owner_type TEXT NOT NULL CHECK (owner_type IN ('landlord', 'broker')),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    location TEXT,
    property_type TEXT NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    size_sqft DECIMAL(10,2),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'sold')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User profiles policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Verification requests policies
CREATE POLICY "Users can view their own verification requests"
    ON verification_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification requests"
    ON verification_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Properties policies
CREATE POLICY "Everyone can view available properties"
    ON properties FOR SELECT
    USING (status = 'available');

CREATE POLICY "Verified users can manage their own properties"
    ON properties FOR ALL
    USING (
        owner_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM verification_requests
            WHERE user_id = auth.uid()
            AND status = 'approved'
        )
    ); 