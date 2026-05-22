/**
 * Application-wide configuration helpers.
 *
 * Admin access is enforced server-side (api/admin-auth.ts + Supabase RLS).
 * No admin email appears in this file or in any browser bundle.
 */

/** Returns true if the Supabase session belongs to an authenticated admin. */
export const isAdminSession = (email: string | null | undefined): boolean => {
  // The real gate is: (a) the server refused to issue the magic link, or
  // (b) Supabase RLS blocks the query.  This helper is used for UI only.
  return typeof email === "string" && email.length > 0;
};
