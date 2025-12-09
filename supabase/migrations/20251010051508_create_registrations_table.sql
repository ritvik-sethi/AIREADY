/*
  # Create registrations table for AI Ready certification

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key) - Unique identifier for each registration
      - `registration_type` (text) - Type of registration: individual, university, school, or organization
      - `name` (text) - Full name of the registrant or contact person
      - `email` (text) - Email address for communication
      - `phone` (text) - Contact phone number
      - `organization` (text, nullable) - Organization name (for non-individual registrations)
      - `address` (text) - Physical address or location
      - `additional_info` (text, nullable) - Optional additional information
      - `created_at` (timestamptz) - Timestamp of registration

  2. Security
    - Enable RLS on `registrations` table
    - Add policy for public insert (anyone can register)
    - Add policy for authenticated users to read registrations
    
  3. Important Notes
    - Email addresses should be unique to prevent duplicate registrations
    - Registration types are constrained to valid categories
    - Data is stored securely with proper RLS policies
*/

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_type text NOT NULL CHECK (registration_type IN ('individual', 'university', 'school', 'organization')),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  organization text,
  address text NOT NULL,
  additional_info text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (register)
CREATE POLICY "Anyone can register"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Authenticated users can view all registrations
CREATE POLICY "Authenticated users can view registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- Create index on registration_type for filtering
CREATE INDEX IF NOT EXISTS idx_registrations_type ON registrations(registration_type);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);
