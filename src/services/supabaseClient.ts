/**
 * Studio Royale - Supabase Client Integration Service
 * Configured using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * Safely handles client initialization without breaking local storage functionality.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://sskbgfdpkrwfstsdnvkq.supabase.co';
const DEFAULT_ANON_KEY = 'sb_publishable_lE3PSpqyYTj2eU51k9GbWA_V3Ra1Zum';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : (process.env || {});
export const supabaseUrl = env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
);

/**
 * Singleton Supabase Client Instance.
 * Returns null if credentials are not configured.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

