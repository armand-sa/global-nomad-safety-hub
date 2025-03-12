export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      alerts: {
        Row: {
          id: string
          location_id: string
          title: string
          description: string
          priority: 'high' | 'medium' | 'low'
          status: 'active' | 'inactive' | 'scheduled'
          source: string | null
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          location_id: string
          title: string
          description: string
          priority?: 'high' | 'medium' | 'low'
          status?: 'active' | 'inactive' | 'scheduled'
          source?: string | null
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          location_id?: string
          title?: string
          description?: string
          priority?: 'high' | 'medium' | 'low'
          status?: 'active' | 'inactive' | 'scheduled'
          source?: string | null
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "locations"
            referencedColumns: ["id"]
          }
        ]
      }
      locations: {
        Row: {
          id: string
          city: string
          country: string
          latitude: number
          longitude: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          city: string
          country: string
          latitude: number
          longitude: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          city?: string
          country?: string
          latitude?: number
          longitude?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      safety_scores: {
        Row: {
          id: string
          location_id: string
          overall_score: number
          crime_score: number | null
          health_score: number | null
          natural_disaster_score: number | null
          political_score: number | null
          lgbtq_score: number | null
          women_score: number | null
          digital_security_score: number | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          location_id: string
          overall_score: number
          crime_score?: number | null
          health_score?: number | null
          natural_disaster_score?: number | null
          political_score?: number | null
          lgbtq_score?: number | null
          women_score?: number | null
          digital_security_score?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          location_id?: string
          overall_score?: number
          crime_score?: number | null
          health_score?: number | null
          natural_disaster_score?: number | null
          political_score?: number | null
          lgbtq_score?: number | null
          women_score?: number | null
          digital_security_score?: number | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_scores_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "locations"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          name: string | null
          phone: string | null
          premium_user: boolean
          premium_until: string | null
          email_notifications: boolean
          push_notifications: boolean
          sms_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          phone?: string | null
          premium_user?: boolean
          premium_until?: string | null
          email_notifications?: boolean
          push_notifications?: boolean
          sms_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          phone?: string | null
          premium_user?: boolean
          premium_until?: string | null
          email_notifications?: boolean
          push_notifications?: boolean
          sms_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          location_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          location_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          location_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_priority: 'high' | 'medium' | 'low'
      alert_status: 'active' | 'inactive' | 'scheduled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type Location = Tables<'locations'>
export type SafetyScore = Tables<'safety_scores'>
export type Alert = Tables<'alerts'>
export type UserProfile = Tables<'user_profiles'>
export type UserSubscription = Tables<'user_subscriptions'>