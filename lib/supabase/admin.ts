import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

/**
 * Creates an administrative Supabase client using the Secret Service Role Key.
 *
 * CAUTION:
 * This client bypasses Row Level Security (RLS).
 * It MUST NEVER be used on the client side or exposed to the browser.
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('createAdminClient must only be called on the server side.');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in server environment.'
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
