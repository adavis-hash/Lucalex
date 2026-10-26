import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

let cachedClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

function sanitizeUrl(rawUrl?: string): string {
  if (!rawUrl) return 'https://placeholder.supabase.co';
  let url = rawUrl.trim();
  if (!url) return 'https://placeholder.supabase.co';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, '');
}

function sanitizeKey(rawKey?: string): string {
  if (!rawKey) return 'placeholder-publishable-key';
  const key = rawKey.trim();
  return key || 'placeholder-publishable-key';
}

/**
 * Creates or retrieves a Supabase client for use in Client Components (Browser).
 * Uses public environment variables and maintains session persistence in cookies.
 * Guaranteed not to throw during build / SSR even if environment variables are unset or malformed.
 */
export function createClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabaseUrl = sanitizeUrl(rawUrl);
  const supabaseKey = sanitizeKey(rawKey);

  try {
    cachedClient = createBrowserClient<Database>(supabaseUrl, supabaseKey);
    return cachedClient;
  } catch (err) {
    console.warn(
      'Failed to initialize Supabase browser client, falling back to safe placeholder:',
      err
    );
    try {
      cachedClient = createBrowserClient<Database>(
        'https://placeholder.supabase.co',
        'placeholder-publishable-key'
      );
      return cachedClient;
    } catch {
      return {} as ReturnType<typeof createBrowserClient<Database>>;
    }
  }
}

