import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ??
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string);

const supabaseKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ??
  (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string);

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);
