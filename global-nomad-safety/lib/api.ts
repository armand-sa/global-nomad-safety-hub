import { supabase } from './supabase';
import { Database } from './supabase-types';
import { Location, SafetyScore, Alert, UserProfile, UserSubscription } from './supabase-types';

// Locations API
export async function getLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('city');
  
  if (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
  
  return data as Location[];
}

export async function getLocationById(id: string) {
  const { data, error } = await supabase
    .from('locations')
    .select('*, safety_scores(*)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching location ${id}:`, error);
    throw error;
  }
  
  return data as Location & { safety_scores: SafetyScore };
}

export async function searchLocations(query: string) {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .or(`city.ilike.%${query}%,country.ilike.%${query}%`)
    .order('city')
    .limit(10);
  
  if (error) {
    console.error(`Error searching locations with query "${query}":`, error);
    throw error;
  }
  
  return data as Location[];
}

// Safety Scores API
export async function getSafetyScores() {
  const { data, error } = await supabase
    .from('safety_scores')
    .select('*, locations(*)');
  
  if (error) {
    console.error('Error fetching safety scores:', error);
    throw error;
  }
  
  return data as (SafetyScore & { locations: Location })[];
}

export async function getSafetyScoreByLocationId(locationId: string) {
  const { data, error } = await supabase
    .from('safety_scores')
    .select('*')
    .eq('location_id', locationId)
    .single();
  
  if (error) {
    console.error(`Error fetching safety score for location ${locationId}:`, error);
    throw error;
  }
  
  return data as SafetyScore;
}

export async function getTopSafeLocations(limit: number = 5) {
  const { data, error } = await supabase
    .from('safety_scores')
    .select('*, locations(*)')
    .order('overall_score', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching top safe locations:', error);
    throw error;
  }
  
  return data as (SafetyScore & { locations: Location })[];
}

// Alerts API
export async function getAlerts(status?: 'active' | 'inactive' | 'scheduled') {
  let query = supabase
    .from('alerts')
    .select('*, locations(*)');
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('start_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
  
  return data as (Alert & { locations: Location })[];
}

export async function getAlertById(id: string) {
  const { data, error } = await supabase
    .from('alerts')
    .select('*, locations(*)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching alert ${id}:`, error);
    throw error;
  }
  
  return data as Alert & { locations: Location };
}

export async function getAlertsByLocationId(locationId: string) {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('location_id', locationId)
    .order('start_date', { ascending: false });
  
  if (error) {
    console.error(`Error fetching alerts for location ${locationId}:`, error);
    throw error;
  }
  
  return data as Alert[];
}

export async function createAlert(alert: Database['public']['Tables']['alerts']['Insert']) {
  const { data, error } = await supabase
    .from('alerts')
    .insert(alert)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
  
  return data as Alert;
}

export async function updateAlert(id: string, updates: Database['public']['Tables']['alerts']['Update']) {
  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating alert ${id}:`, error);
    throw error;
  }
  
  return data as Alert;
}

export async function deleteAlert(id: string) {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting alert ${id}:`, error);
    throw error;
  }
  
  return true;
}

// User Profiles API
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error(`Error fetching user profile for ${userId}:`, error);
    throw error;
  }
  
  return data as UserProfile;
}

export async function updateUserProfile(userId: string, updates: Database['public']['Tables']['user_profiles']['Update']) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating user profile for ${userId}:`, error);
    throw error;
  }
  
  return data as UserProfile;
}

export async function upgradeUserToPremium(userId: string, expirationDate: Date) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      premium_user: true,
      premium_until: expirationDate.toISOString(),
      push_notifications: true,
      sms_notifications: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error(`Error upgrading user ${userId} to premium:`, error);
    throw error;
  }
  
  return data as UserProfile;
}

// User Subscriptions API
export async function getUserSubscriptions(userId: string) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*, locations(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error(`Error fetching subscriptions for user ${userId}:`, error);
    throw error;
  }
  
  return data as (UserSubscription & { locations: Location })[];
}

export async function subscribeToLocation(userId: string, locationId: string) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({ user_id: userId, location_id: locationId })
    .select()
    .single();
  
  if (error) {
    console.error(`Error subscribing user ${userId} to location ${locationId}:`, error);
    throw error;
  }
  
  return data as UserSubscription;
}

export async function unsubscribeFromLocation(userId: string, locationId: string) {
  const { error } = await supabase
    .from('user_subscriptions')
    .delete()
    .eq('user_id', userId)
    .eq('location_id', locationId);
  
  if (error) {
    console.error(`Error unsubscribing user ${userId} from location ${locationId}:`, error);
    throw error;
  }
  
  return true;
}

export async function isUserSubscribedToLocation(userId: string, locationId: string) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('location_id', locationId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "No rows returned"
    console.error(`Error checking subscription for user ${userId} to location ${locationId}:`, error);
    throw error;
  }
  
  return !!data;
}

// Admin API Functions
export async function createLocation(location: Database['public']['Tables']['locations']['Insert']) {
  const { data, error } = await supabase
    .from('locations')
    .insert(location)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating location:', error);
    throw error;
  }
  
  return data as Location;
}

export async function updateLocation(id: string, updates: Database['public']['Tables']['locations']['Update']) {
  const { data, error } = await supabase
    .from('locations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating location ${id}:`, error);
    throw error;
  }
  
  return data as Location;
}

export async function createOrUpdateSafetyScore(score: Database['public']['Tables']['safety_scores']['Insert']) {
  // Check if a safety score already exists for this location
  const { data: existingScore } = await supabase
    .from('safety_scores')
    .select('id')
    .eq('location_id', score.location_id)
    .single();
  
  if (existingScore) {
    // Update existing score
    const { data, error } = await supabase
      .from('safety_scores')
      .update(score)
      .eq('id', existingScore.id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating safety score ${existingScore.id}:`, error);
      throw error;
    }
    
    return data as SafetyScore;
  } else {
    // Create new score
    const { data, error } = await supabase
      .from('safety_scores')
      .insert(score)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating safety score:', error);
      throw error;
    }
    
    return data as SafetyScore;
  }
}