-- Add missing columns to profiles table for address information

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Latvija';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;
