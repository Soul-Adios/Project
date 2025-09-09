// src/integrations/supabase/types.ts
// Types for Django API responses

export interface User {
  id: number;
  username: string;
  email: string;
  total_points: number;
  total_weight: number;
}

export interface WasteSubmission {
  id: number;
  waste_type: string;
  weight_kg: number;
  date: string;
  points: number;
}

export interface DashboardData {
  total_weight: number;
  total_points: number;
  progress: number;
}

export interface LeaderboardEntry {
  username: string;
  points: number;
}

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user_id: number;
  username: string;
  email: string;
  total_points: number;
  total_weight: number;
}

export interface SignupResponse {
  message: string;
  user_id: number;
}

// For backward compatibility with existing code that expects Supabase types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          total_points: number;
          total_weight: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          total_points?: number;
          total_weight?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          total_points?: number;
          total_weight?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      waste_submissions: {
        Row: {
          created_at: string;
          id: string;
          points: number;
          user_id: string;
          waste_type: string;
          weight: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          points: number;
          user_id: string;
          waste_type: string;
          weight: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          points?: number;
          user_id?: string;
          waste_type?: string;
          weight?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Export types for backward compatibility
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];