import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

/**
 * Creates an administrative Supabase client using the Secret Key.
 *
 * CAUTION:
 * This client bypasses Row Level Security (RLS).
 * - It MUST NEVER be used on the client side, exposed in public variables, or returned in HTTP responses.
 * - Standard storefront operations (browsing, carts, profile, orders) MUST use RLS clients (lib/supabase/server.ts or lib/supabase/client.ts).
 * - This admin client should only be used in strictly necessary server-only administrative tasks or scripts (e.g., seeding, webhooks).
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('createAdminClient must only be called on the server side.');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !secretKey) {
    throw new Error(
      'Missing SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) or NEXT_PUBLIC_SUPABASE_URL in server environment.'
    );
  }

  return createClient<Database>(supabaseUrl, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
