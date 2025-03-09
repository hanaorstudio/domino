
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hdyjxjtdwrbcejqpidqt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkeWp4anRkd3JiY2VqcXBpZHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NTM4OTQsImV4cCI6MjA1NzEyOTg5NH0.Bu3HS2gkDyq8_Zp-c1AxiRghgTpek-Pzuj3ZqSDuzgE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
