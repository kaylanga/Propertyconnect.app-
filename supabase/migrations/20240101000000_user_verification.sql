-- Create verification_requests table
CREATE TABLE verification_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_type TEXT NOT NULL CHECK (user_type IN ('landlord', 'broker')),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  business_license TEXT,
  office_location TEXT,
  property_proof TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create properties table
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Verification requests policies
CREATE POLICY "Users can view their own verification requests"
  ON verification_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification requests"
  ON verification_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Properties policies
CREATE POLICY "Verified users can manage their own properties"
  ON properties FOR ALL
  USING (
    auth.uid() = owner_id AND
    EXISTS (
      SELECT 1 FROM verification_requests
      WHERE user_id = auth.uid()
      AND status = 'approved'
    )
  ); 