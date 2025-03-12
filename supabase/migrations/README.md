# Supabase Migrations

This directory contains SQL migrations for the Supabase database. The migrations define the schema and initial data for the Global Digital Nomad Safety Hub application.

## Migration Files

- `20250311150209_safety_schema.sql` - Initial schema that creates tables for locations, safety scores, alerts, user profiles, and user subscriptions.

## Running Migrations

Migrations are automatically applied when:

1. Using the Supabase CLI with `supabase migration up`
2. Linking your project to the Supabase project

If you need to run migrations manually, you can execute the SQL files in the Supabase SQL editor.

## Schema Overview

The database schema consists of the following tables:

### locations
- Stores cities and countries with geographic coordinates
- Public readable, admin-only write access
- Contains sample data for popular digital nomad destinations

### safety_scores
- Contains safety ratings for locations across multiple categories:
  - Overall score
  - Crime score
  - Health score
  - Natural disaster score
  - Political score
  - LGBTQ+ safety score
  - Women's safety score
  - Digital security score
- Linked to locations table
- Public readable, admin-only write access

### alerts
- Stores safety alerts and notifications
- Linked to locations table
- Has priority levels (high, medium, low)
- Status tracking (active, inactive, scheduled)
- Public readable for active alerts, admin-only write access

### user_profiles
- Extends auth.users with additional user data
- Stores notification preferences and subscription status
- User-specific read/write access
- Created automatically when a new user signs up

### user_subscriptions
- Tracks which locations users are subscribed to for alerts
- Links users to locations
- User-specific read/write access

## Row Level Security

All tables have Row Level Security (RLS) enabled with appropriate policies:

- Public can read most data (locations, safety scores, active alerts)
- Users can only manage their own profiles and subscriptions
- Only admin users can create or modify locations, safety scores, and alerts

## Triggers

The schema includes several triggers:

- Automatic update of `updated_at` timestamps when rows are modified
- Automatic creation of a user profile when a new user signs up in Auth