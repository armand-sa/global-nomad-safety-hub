/*
  # Global Digital Nomad Safety Hub Schema

  1. New Tables
    - `locations` - Stores city & country data with coordinates
    - `safety_scores` - Stores safety ratings linked to locations
    - `alerts` - Stores safety alerts & notifications
    - `user_profiles` - Extends auth.users with user preferences
    - `user_subscriptions` - Tracks which locations users are subscribed to

  2. Security
    - Enable RLS on all tables
    - Public read access for locations, safety_scores, and active alerts
    - User-specific access for user_profiles and user_subscriptions
    - Admin-only write access for locations, safety_scores, and alerts
*/

-- Create extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for alert priorities and statuses
CREATE TYPE alert_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE alert_status AS ENUM ('active', 'inactive', 'scheduled');

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(city, country)
);

-- Create index on locations for faster lookups
CREATE INDEX IF NOT EXISTS locations_city_country_idx ON locations(city, country);

-- Create safety_scores table
CREATE TABLE IF NOT EXISTS safety_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  crime_score INTEGER CHECK (crime_score >= 0 AND crime_score <= 100),
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  natural_disaster_score INTEGER CHECK (natural_disaster_score >= 0 AND natural_disaster_score <= 100),
  political_score INTEGER CHECK (political_score >= 0 AND political_score <= 100),
  lgbtq_score INTEGER CHECK (lgbtq_score >= 0 AND lgbtq_score <= 100),
  women_score INTEGER CHECK (women_score >= 0 AND women_score <= 100),
  digital_security_score INTEGER CHECK (digital_security_score >= 0 AND digital_security_score <= 100),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(location_id)
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority alert_priority NOT NULL DEFAULT 'medium',
  status alert_status NOT NULL DEFAULT 'scheduled',
  source TEXT,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes on alerts
CREATE INDEX IF NOT EXISTS alerts_location_id_idx ON alerts(location_id);
CREATE INDEX IF NOT EXISTS alerts_status_idx ON alerts(status);
CREATE INDEX IF NOT EXISTS alerts_start_date_idx ON alerts(start_date);

-- Create user_profiles table that extends auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  premium_user BOOLEAN NOT NULL DEFAULT FALSE,
  premium_until TIMESTAMPTZ,
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  push_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  sms_notifications BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

-- Create index on user_subscriptions
CREATE INDEX IF NOT EXISTS user_subscriptions_user_id_idx ON user_subscriptions(user_id);

-- Create trigger functions to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table to update updated_at
CREATE TRIGGER set_timestamp_locations
BEFORE UPDATE ON locations
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_safety_scores
BEFORE UPDATE ON safety_scores
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_alerts
BEFORE UPDATE ON alerts
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER set_timestamp_user_profiles
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to create a user_profile when a new user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Enable Row Level Security on all tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy: Everyone can read locations
CREATE POLICY "Anyone can read locations"
  ON locations FOR SELECT
  USING (true);

-- Create policy: Only admins can edit locations
CREATE POLICY "Only admins can insert/update/delete locations"
  ON locations FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create policy: Everyone can read safety scores
CREATE POLICY "Anyone can read safety scores"
  ON safety_scores FOR SELECT
  USING (true);

-- Create policy: Only admins can edit safety scores
CREATE POLICY "Only admins can insert/update/delete safety scores"
  ON safety_scores FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create policy: Everyone can read active alerts
CREATE POLICY "Anyone can read active alerts"
  ON alerts FOR SELECT
  USING (status = 'active' OR auth.jwt() ->> 'role' = 'admin');

-- Create policy: Only admins can edit alerts
CREATE POLICY "Only admins can insert/update/delete alerts"
  ON alerts FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create policy: Users can read their own profiles
CREATE POLICY "Users can read own profiles"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy: Users can update their own profiles
CREATE POLICY "Users can update own profiles"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policy: Admins can read all user profiles
CREATE POLICY "Admins can read all user profiles"
  ON user_profiles FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create policy: Admins can update all user profiles
CREATE POLICY "Admins can update all user profiles"
  ON user_profiles FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create policy: Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions"
  ON user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own subscriptions
CREATE POLICY "Users can delete own subscriptions"
  ON user_subscriptions FOR DELETE
  USING (auth.uid() = user_id);

-- Create policy: Admins can manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions"
  ON user_subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Insert initial sample locations
INSERT INTO locations (city, country, latitude, longitude) VALUES
  ('Barcelona', 'Spain', 41.3851, 2.1734),
  ('Lisbon', 'Portugal', 38.7223, -9.1393),
  ('Bali', 'Indonesia', -8.3405, 115.0920),
  ('Medellin', 'Colombia', 6.2476, -75.5658),
  ('Bangkok', 'Thailand', 13.7563, 100.5018),
  ('Chiang Mai', 'Thailand', 18.7883, 98.9853),
  ('Berlin', 'Germany', 52.5200, 13.4050),
  ('Mexico City', 'Mexico', 19.4326, -99.1332)
ON CONFLICT (city, country) DO NOTHING;

-- Insert initial safety scores for the sample locations
DO $$
DECLARE
  location_rec RECORD;
BEGIN
  FOR location_rec IN SELECT id FROM locations LOOP
    INSERT INTO safety_scores (
      location_id, 
      overall_score, 
      crime_score, 
      health_score, 
      natural_disaster_score, 
      political_score, 
      lgbtq_score, 
      women_score, 
      digital_security_score,
      description
    ) VALUES (
      location_rec.id,
      CASE 
        WHEN (SELECT country FROM locations WHERE id = location_rec.id) = 'Portugal' THEN 92
        WHEN (SELECT city FROM locations WHERE id = location_rec.id) = 'Medellin' THEN 71
        WHEN (SELECT city FROM locations WHERE id = location_rec.id) = 'Bali' THEN 82
        WHEN (SELECT city FROM locations WHERE id = location_rec.id) = 'Bangkok' THEN 85
        WHEN (SELECT city FROM locations WHERE id = location_rec.id) = 'Berlin' THEN 89
        WHEN (SELECT city FROM locations WHERE id = location_rec.id) = 'Mexico City' THEN 68
        ELSE FLOOR(RANDOM() * 30 + 70)
      END,
      FLOOR(RANDOM() * 40 + 60),
      FLOOR(RANDOM() * 40 + 60),
      FLOOR(RANDOM() * 40 + 60),
      FLOOR(RANDOM() * 40 + 60),
      FLOOR(RANDOM() * 40 + 60),
      FLOOR(RANDOM() * 40 + 60),
      FLOOR(RANDOM() * 40 + 60),
      CASE 
        WHEN (SELECT country FROM locations WHERE id = location_rec.id) = 'Portugal' THEN 'Very Safe'
        WHEN (SELECT city FROM locations WHERE id = location_rec.id) = 'Medellin' THEN 'Exercise Caution'
        WHEN (SELECT city FROM locations WHERE id = location_rec.id) = 'Bali' THEN 'Generally Safe'
        WHEN (SELECT city FROM locations WHERE id = location_rec.id) = 'Bangkok' THEN 'Generally Safe'
        WHEN (SELECT city FROM locations WHERE id = location_rec.id) = 'Berlin' THEN 'Generally Safe'
        WHEN (SELECT city FROM locations WHERE id = location_rec.id) = 'Mexico City' THEN 'Exercise Caution'
        ELSE 'Generally Safe'
      END
    ) ON CONFLICT (location_id) DO NOTHING;
  END LOOP;
END $$;

-- Insert sample alerts
DO $$
DECLARE
  barcelona_id UUID;
  bali_id UUID;
  lisbon_id UUID;
  medellin_id UUID;
  bangkok_id UUID;
  chiang_mai_id UUID;
BEGIN
  SELECT id INTO barcelona_id FROM locations WHERE city = 'Barcelona' AND country = 'Spain';
  SELECT id INTO bali_id FROM locations WHERE city = 'Bali' AND country = 'Indonesia';
  SELECT id INTO lisbon_id FROM locations WHERE city = 'Lisbon' AND country = 'Portugal';
  SELECT id INTO medellin_id FROM locations WHERE city = 'Medellin' AND country = 'Colombia';
  SELECT id INTO bangkok_id FROM locations WHERE city = 'Bangkok' AND country = 'Thailand';
  SELECT id INTO chiang_mai_id FROM locations WHERE city = 'Chiang Mai' AND country = 'Thailand';
  
  IF barcelona_id IS NOT NULL THEN
    INSERT INTO alerts (location_id, title, description, priority, status, source, start_date)
    VALUES (barcelona_id, 'Increased Pickpocketing Reports', 'Multiple reports of pickpocketing incidents near La Rambla and Gothic Quarter. Keep valuables secure and remain vigilant.', 'high', 'active', 'Local Police Reports', NOW() - INTERVAL '2 hours');
  END IF;
  
  IF bali_id IS NOT NULL THEN
    INSERT INTO alerts (location_id, title, description, priority, status, source, start_date)
    VALUES (bali_id, 'Minor Earthquake Reported', '5.2 magnitude earthquake detected offshore. No tsunami warning issued. No major damage reported in tourist areas.', 'medium', 'active', 'Geological Survey', NOW() - INTERVAL '5 hours');
  END IF;
  
  IF lisbon_id IS NOT NULL THEN
    INSERT INTO alerts (location_id, title, description, priority, status, source, start_date)
    VALUES (lisbon_id, 'Public Transportation Strike', 'Metro workers on 24-hour strike affecting all lines. Consider alternative transportation options.', 'low', 'active', 'Local News', NOW() - INTERVAL '12 hours');
  END IF;
  
  IF medellin_id IS NOT NULL THEN
    INSERT INTO alerts (location_id, title, description, priority, status, source, start_date)
    VALUES (medellin_id, 'Protests Scheduled Downtown', 'Peaceful demonstrations planned in El Centro from 2-6 PM. Expect traffic delays and increased police presence.', 'medium', 'active', 'City Announcement', NOW() - INTERVAL '1 day');
  END IF;
  
  IF bangkok_id IS NOT NULL THEN
    INSERT INTO alerts (location_id, title, description, priority, status, source, start_date)
    VALUES (bangkok_id, 'Taxi Driver Strike', 'Taxi drivers are on strike in central districts. Use ride-sharing apps or public transport.', 'low', 'inactive', 'Transportation Ministry', NOW() - INTERVAL '3 days');
  END IF;
  
  IF chiang_mai_id IS NOT NULL THEN
    INSERT INTO alerts (location_id, title, description, priority, status, source, start_date)
    VALUES (chiang_mai_id, 'Flash Flooding in Northern Areas', 'Heavy rains have caused localized flooding in northern neighborhoods. Avoid the following areas: Mae Rim, San Sai.', 'high', 'inactive', 'Weather Service', NOW() - INTERVAL '5 days');
  END IF;
END $$;