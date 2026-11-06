import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://fwfqupqqruygbgomlgeb.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3ZnF1cHFxcnV5Z2Jnb21sZ2ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1ODIxMTMsImV4cCI6MjEwODE1ODExM30.9iHfhgnbhqpxBqG9mrGlHqdewauKRhPtdWv7vUqLm04';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
