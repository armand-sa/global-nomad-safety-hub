/*
  # Initial schema for Global Digital Nomad Safety Hub

  1. New Tables
    - `locations` - Stores city and country information
    - `safety_scores` - Stores safety ratings for locations
    - `alerts` - Stores safety alerts and notifications
    - `user_profiles` - Extends auth.users with additional user data
    - `user_subscriptions` - Tracks user location subscriptions
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated and anon users
*/

-- Create extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- LOCATIONS Table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(city, country)
);

-- Enable RLS on locations
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to locations
CREATE POLICY "Locations are viewable by everyone" 
  ON locations 
  FOR SELECT 
  USING (true);

-- Allow only authenticated admin users to insert/update locations
CREATE POLICY "Only admins can insert locations" 
  ON locations 
  FOR INSERT 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update locations" 
  ON locations 
  FOR UPDATE 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');

-- SAFETY_SCORES Table
CREATE TABLE IF NOT EXISTS safety_scores (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  crime_score INTEGER CHECK (crime_score BETWEEN 0 AND 100),
  health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
  natural_disaster_score INTEGER CHECK (natural_disaster_score BETWEEN 0 AND 100),
  political_score INTEGER CHECK (political_score BETWEEN 0 AND 100),
  lgbtq_score INTEGER CHECK (lgbtq_score BETWEEN 0 AND 100),
  women_score INTEGER CHECK (women_score BETWEEN 0 AND 100),
  digital_security_score INTEGER CHECK (digital_security_score BETWEEN 0 AND 100),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(location_id)
);

-- Enable RLS on safety_scores
ALTER TABLE safety_scores ENABLE ROW LEVEL SECURITY;

-- Allow public read access to safety_scores
CREATE POLICY "Safety scores are viewable by everyone" 
  ON safety_scores 
  FOR SELECT 
  USING (true);

-- Allow only authenticated admin users to insert/update safety_scores
CREATE POLICY "Only admins can insert safety scores" 
  ON safety_scores 
  FOR INSERT 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update safety scores" 
  ON safety_scores 
  FOR UPDATE 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');

-- ALERTS Table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'scheduled')),
  source TEXT,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on alerts
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to alerts
CREATE POLICY "Alerts are viewable by everyone" 
  ON alerts 
  FOR SELECT 
  USING (true);

-- Allow only authenticated admin users to insert/update alerts
CREATE POLICY "Only admins can insert alerts" 
  ON alerts 
  FOR INSERT 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can update alerts" 
  ON alerts 
  FOR UPDATE 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin');

-- USER_PROFILES Table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  premium_user BOOLEAN DEFAULT false,
  premium_until TIMESTAMPTZ,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view and update their own profiles
CREATE POLICY "Users can view own profile" 
  ON user_profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON user_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- USER_SUBSCRIPTIONS Table (tracks locations users are subscribed to)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, location_id)
);

-- Enable RLS on user_subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to manage only their own subscriptions
CREATE POLICY "Users can view own subscriptions" 
  ON user_subscriptions 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" 
  ON user_subscriptions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions" 
  ON user_subscriptions 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Function to create a user profile on signup
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email_notifications)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', true);
  RETURN NEW;
END;
$$;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_user();

-- Insert some sample data for development
DO $$
BEGIN
  -- Sample Locations
  INSERT INTO locations (city, country, latitude, longitude)
  VALUES
    ('Barcelona', 'Spain', 41.390205, 2.154007),
    ('Lisbon', 'Portugal', 38.722252, -9.139337),
    ('Bali', 'Indonesia', -8.4095178, 115.188916),
    ('Medellin', 'Colombia', 6.244203, -75.581212),
    ('Chiang Mai', 'Thailand', 18.787747, 98.997597),
    ('Berlin', 'Germany', 52.520008, 13.404954),
    ('Mexico City', 'Mexico', 19.432608, -99.133209),
    ('Bangkok', 'Thailand', 13.756331, 100.501762)
  ON CONFLICT (city, country) DO NOTHING;

  -- Sample Safety Scores
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
  )
  SELECT 
    id, 
    CASE 
      WHEN city = 'Barcelona' THEN 85
      WHEN city = 'Lisbon' THEN 92
      WHEN city = 'Bali' THEN 82
      WHEN city = 'Medellin' THEN 71
      WHEN city = 'Chiang Mai' THEN 88
      WHEN city = 'Berlin' THEN 89
      WHEN city = 'Mexico City' THEN 68
      WHEN city = 'Bangkok' THEN 85
      ELSE 75
    END,
    CASE 
      WHEN city = 'Barcelona' THEN 75 
      WHEN city = 'Lisbon' THEN 90
      WHEN city = 'Bali' THEN 80
      WHEN city = 'Medellin' THEN 65
      WHEN city = 'Chiang Mai' THEN 85
      WHEN city = 'Berlin' THEN 85
      WHEN city = 'Mexico City' THEN 60
      WHEN city = 'Bangkok' THEN 75
      ELSE 75
    END,
    CASE 
      WHEN city = 'Barcelona' THEN 90
      WHEN city = 'Lisbon' THEN 92
      WHEN city = 'Bali' THEN 75
      WHEN city = 'Medellin' THEN 80
      WHEN city = 'Chiang Mai' THEN 80
      WHEN city = 'Berlin' THEN 95
      WHEN city = 'Mexico City' THEN 75
      WHEN city = 'Bangkok' THEN 80
      ELSE 80
    END,
    CASE 
      WHEN city = 'Barcelona' THEN 95
      WHEN city = 'Lisbon' THEN 90
      WHEN city = 'Bali' THEN 65
      WHEN city = 'Medellin' THEN 85
      WHEN city = 'Chiang Mai' THEN 75
      WHEN city = 'Berlin' THEN 95
      WHEN city = 'Mexico City' THEN 70
      WHEN city = 'Bangkok' THEN 75
      ELSE 80
    END,
    CASE 
      WHEN city = 'Barcelona' THEN 90
      WHEN city = 'Lisbon' THEN 95
      WHEN city = 'Bali' THEN 85
      WHEN city = 'Medellin' THEN 70
      WHEN city = 'Chiang Mai' THEN 90
      WHEN city = 'Berlin' THEN 90
      WHEN city = 'Mexico City' THEN 75
      WHEN city = 'Bangkok' THEN 90
      ELSE 80
    END,
    CASE 
      WHEN city = 'Barcelona' THEN 90
      WHEN city = 'Lisbon' THEN 95
      WHEN city = 'Bali' THEN 70
      WHEN city = 'Medellin' THEN 65
      WHEN city = 'Chiang Mai' THEN 75
      WHEN city = 'Berlin' THEN 95
      WHEN city = 'Mexico City' THEN 65
      WHEN city = 'Bangkok' THEN 80
      ELSE 75
    END,
    CASE 
      WHEN city = 'Barcelona' THEN 80
      WHEN city = 'Lisbon' THEN 90
      WHEN city = 'Bali' THEN 75
      WHEN city = 'Medellin' THEN 65
      WHEN city = 'Chiang Mai' THEN 85
      WHEN city = 'Berlin' THEN 90
      WHEN city = 'Mexico City' THEN 60
      WHEN city = 'Bangkok' THEN 75
      ELSE 75
    END,
    CASE 
      WHEN city = 'Barcelona' THEN 85
      WHEN city = 'Lisbon' THEN 85
      WHEN city = 'Bali' THEN 70
      WHEN city = 'Medellin' THEN 75
      WHEN city = 'Chiang Mai' THEN 80
      WHEN city = 'Berlin' THEN 90
      WHEN city = 'Mexico City' THEN 75
      WHEN city = 'Bangkok' THEN 80
      ELSE 80
    END,
    CASE 
      WHEN city = 'Barcelona' THEN 'Generally safe with some petty crime concerns. Exercise normal precautions.'
      WHEN city = 'Lisbon' THEN 'Very safe overall. Excellent destination for digital nomads with minimal safety concerns.'
      WHEN city = 'Bali' THEN 'Generally safe with some health concerns. Watch for natural disasters during rainy season.'
      WHEN city = 'Medellin' THEN 'Exercise increased caution, especially at night. Stay in recommended neighborhoods.'
      WHEN city = 'Chiang Mai' THEN 'Safe destination for nomads. Air quality issues during burning season (Feb-Apr).'
      WHEN city = 'Berlin' THEN 'Generally very safe with excellent infrastructure and healthcare.'
      WHEN city = 'Mexico City' THEN 'Exercise caution, especially in certain areas. Stick to recommended neighborhoods.'
      WHEN city = 'Bangkok' THEN 'Generally safe for tourists and nomads. Be cautious of scams and petty theft.'
      ELSE 'No detailed description available.'
    END
  FROM locations
  ON CONFLICT (location_id) DO NOTHING;

  -- Sample Alerts
  INSERT INTO alerts (
    location_id, 
    title, 
    description, 
    priority, 
    status, 
    source,
    start_date,
    end_date
  )
  SELECT 
    id,
    CASE 
      WHEN city = 'Barcelona' THEN 'Increased Pickpocketing Reports'
      WHEN city = 'Bali' THEN 'Minor Earthquake Reported'
      WHEN city = 'Lisbon' THEN 'Public Transportation Strike'
      WHEN city = 'Medellin' THEN 'Protests Scheduled Downtown'
      WHEN city = 'Bangkok' THEN 'Taxi Driver Strike'
      WHEN city = 'Chiang Mai' THEN 'Flash Flooding in Northern Areas'
      WHEN city = 'Seville' THEN 'Heatwave Warning'
      WHEN city = 'Berlin' THEN 'Political Demonstration'
      ELSE 'Safety Alert'
    END,
    CASE 
      WHEN city = 'Barcelona' THEN 'Multiple reports of pickpocketing incidents near La Rambla and Gothic Quarter. Keep valuables secure and remain vigilant.'
      WHEN city = 'Bali' THEN '5.2 magnitude earthquake detected offshore. No tsunami warning issued. No major damage reported in tourist areas.'
      WHEN city = 'Lisbon' THEN 'Metro workers on 24-hour strike affecting all lines. Consider alternative transportation options.'
      WHEN city = 'Medellin' THEN 'Peaceful demonstrations planned in El Centro from 2-6 PM. Expect traffic delays and increased police presence.'
      WHEN city = 'Bangkok' THEN 'Citywide taxi driver strike affecting availability. Use ride-sharing apps or public transportation.'
      WHEN city = 'Chiang Mai' THEN 'Heavy rainfall has caused flash flooding in northern neighborhoods. Avoid low-lying areas.'
      WHEN city = 'Seville' THEN 'Temperatures expected to exceed 40°C (104°F) for the next 5 days. Stay hydrated and limit outdoor activities.'
      WHEN city = 'Berlin' THEN 'Large political demonstration scheduled near Brandenburg Gate. Expect road closures and increased police presence.'
      ELSE 'Alert details not available.'
    END,
    CASE 
      WHEN city IN ('Barcelona', 'Chiang Mai') THEN 'high'
      WHEN city IN ('Bali', 'Medellin', 'Seville') THEN 'medium'
      ELSE 'low'
    END,
    CASE 
      WHEN city IN ('Barcelona', 'Bali', 'Lisbon', 'Medellin') THEN 'active'
      WHEN city IN ('Bangkok', 'Chiang Mai') THEN 'inactive'
      ELSE 'scheduled'
    END,
    CASE 
      WHEN city = 'Barcelona' THEN 'Local Police Reports'
      WHEN city = 'Bali' THEN 'Indonesia Geological Agency'
      WHEN city = 'Lisbon' THEN 'Lisbon Metro Authority'
      WHEN city = 'Medellin' THEN 'Medellin City Government'
      WHEN city = 'Bangkok' THEN 'Bangkok Transport Authority'
      WHEN city = 'Chiang Mai' THEN 'Thai Meteorological Department'
      WHEN city = 'Seville' THEN 'Spanish Weather Service'
      WHEN city = 'Berlin' THEN 'Berlin Police Department'
      ELSE 'Verified Local Sources'
    END,
    now() - interval '1 day' * (CASE WHEN city = 'Barcelona' THEN 0
                               WHEN city = 'Bali' THEN 1
                               WHEN city = 'Lisbon' THEN 2
                               WHEN city = 'Medellin' THEN 3
                               WHEN city = 'Bangkok' THEN 4
                               WHEN city = 'Chiang Mai' THEN 5
                               ELSE 0 END),
    CASE 
      WHEN city IN ('Barcelona', 'Bali', 'Lisbon', 'Medellin') THEN now() + interval '7 days'
      WHEN city IN ('Bangkok', 'Chiang Mai') THEN now() - interval '1 day'
      ELSE now() + interval '14 days'
    END
  FROM locations
  WHERE city IN ('Barcelona', 'Bali', 'Lisbon', 'Medellin', 'Bangkok', 'Chiang Mai', 'Berlin')
  ON CONFLICT DO NOTHING;
END $$;