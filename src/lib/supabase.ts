import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Registration = {
  id: string;
  registration_type: 'individual' | 'university' | 'school' | 'organization';
  name: string;
  email: string;
  phone: string;
  organization: string | null;
  address: string;
  additional_info: string | null;
  created_at: string;
};
