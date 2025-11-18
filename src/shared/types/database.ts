/**
 * Supabase Database Types
 * Supabase CLI로 자동 생성 가능: npx supabase gen types typescript
 */

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
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          subscription_tier: 'free' | 'basic' | 'professional' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_url?: string | null
          subscription_tier?: 'free' | 'basic' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          subscription_tier?: 'free' | 'basic' | 'professional' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: 'free' | 'basic' | 'professional' | 'enterprise'
          status: 'active' | 'cancelled' | 'past_due' | 'trialing'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier?: 'free' | 'basic' | 'professional' | 'enterprise'
          status?: 'active' | 'cancelled' | 'past_due' | 'trialing'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: 'free' | 'basic' | 'professional' | 'enterprise'
          status?: 'active' | 'cancelled' | 'past_due' | 'trialing'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          type: string
          data: Json
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          type: string
          data: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          type?: string
          data?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          invited_by: string | null
          joined_at: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          invited_by?: string | null
          joined_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          invited_by?: string | null
          joined_at?: string
          created_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      payment_history: {
        Row: {
          id: string
          user_id: string
          subscription_id: string
          amount: number
          currency: string
          status: 'pending' | 'succeeded' | 'failed' | 'refunded'
          stripe_payment_id: string | null
          invoice_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id: string
          amount: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          stripe_payment_id?: string | null
          invoice_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          stripe_payment_id?: string | null
          invoice_url?: string | null
          created_at?: string
        }
      }
      webhooks: {
        Row: {
          id: string
          user_id: string
          name: string
          url: string
          events: string[]
          secret: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          url: string
          events: string[]
          secret: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          url?: string
          events?: string[]
          secret?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      dashboard_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          config: Json
          thumbnail_url: string | null
          is_public: boolean
          created_by: string
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          config: Json
          thumbnail_url?: string | null
          is_public?: boolean
          created_by: string
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          config?: Json
          thumbnail_url?: string | null
          is_public?: boolean
          created_by?: string
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: 'free' | 'basic' | 'professional' | 'enterprise'
      subscription_status: 'active' | 'cancelled' | 'past_due' | 'trialing'
      team_role: 'owner' | 'admin' | 'member' | 'viewer'
      payment_status: 'pending' | 'succeeded' | 'failed' | 'refunded'
    }
  }
}
