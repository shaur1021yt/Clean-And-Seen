import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Server-side client (for API routes) — uses service role key when available
export function getSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (serviceRoleKey) {
    // Service role bypasses RLS — use in server-side API routes only
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  // Anon key — respects RLS policies
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Client-side singleton for components
let _browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowser() {
  if (_browserClient) return _browserClient;
  _browserClient = createClient(supabaseUrl, supabaseAnonKey);
  return _browserClient;
}
