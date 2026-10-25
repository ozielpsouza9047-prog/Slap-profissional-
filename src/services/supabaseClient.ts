/**
 * Studio Royale - Supabase Client Integration Service
 * Configured using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * Safely handles client initialization without breaking local storage functionality.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
);

/**
 * Singleton Supabase Client Instance.
 * Returns null if credentials are not yet configured in environment variables.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
