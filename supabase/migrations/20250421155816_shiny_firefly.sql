/*
  # Add Wallet and Verification Tables

  1. New Tables
    - `wallets` - User wallet information
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `balance` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `wallet_transactions`
      - `id` (uuid, primary key)
      - `wallet_id` (uuid, references wallets)
      - `amount` (numeric)
      - `type` (enum: deposit, withdrawal, transfer, subscription)
      - `status` (enum: pending, completed, failed)
      - `created_at` (timestamp)
    
    - `verification_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `type` (enum: landlord, broker)
      - `company_name` (text, for brokers)
      - `license_number` (text, for brokers)
      - `license_image` (text, for brokers)
      - `business_address` (text, for brokers)
      - `ownership_proof` (text, for landlords)
      - `tax_id` (text)
      - `status` (enum: pending, approved, rejected)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create custom types
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'subscription');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE verification_type AS ENUM ('landlord', 'broker');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  balance numeric DEFAULT 0 CHECK (balance >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create wallet_transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES wallets NOT NULL,
  amount numeric NOT NULL,
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending',
  reference_id text,
  created_at timestamptz DEFAULT now()
);

-- Create verification_requests table
CREATE TABLE IF NOT EXISTS verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  type verification_type NOT NULL,
  company_name text,
  license_number text,
  license_image text,
  business_address text,
  ownership_proof text,
  tax_id text NOT NULL,
  status verification_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Wallet policies
CREATE POLICY "Users can view own wallet"
  ON wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Transaction policies
CREATE POLICY "Users can view own transactions"
  ON wallet_transactions
  FOR SELECT
  TO authenticated
  USING (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transactions"
  ON wallet_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

-- Verification request policies
CREATE POLICY "Users can manage own verification requests"
  ON verification_requests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all verification requests"
  ON verification_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create trigger to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    IF NEW.type IN ('deposit', 'transfer') THEN
      UPDATE wallets
      SET balance = balance + NEW.amount,
          updated_at = now()
      WHERE id = NEW.wallet_id;
    ELSIF NEW.type IN ('withdrawal', 'subscription') THEN
      UPDATE wallets
      SET balance = balance - NEW.amount,
          updated_at = now()
      WHERE id = NEW.wallet_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wallet_balance_on_transaction
  AFTER UPDATE OF status ON wallet_transactions
  FOR EACH ROW
  WHEN (OLD.status != 'completed' AND NEW.status = 'completed')
  EXECUTE FUNCTION update_wallet_balance();

-- Create function to handle user role updates
CREATE OR REPLACE FUNCTION handle_verification_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' THEN
    UPDATE users
    SET role = NEW.type::user_role,
        verified = true,
        updated_at = now()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_role_on_verification
  AFTER UPDATE OF status ON verification_requests
  FOR EACH ROW
  WHEN (OLD.status != 'approved' AND NEW.status = 'approved')
  EXECUTE FUNCTION handle_verification_approval();