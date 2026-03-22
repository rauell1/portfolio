/**
 * Application configuration constants derived from environment variables.
 * Set these in your .env file (see .env.example).
 */

/** The email address that has admin access to the CMS. */
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

/**
 * Returns true if the given user email matches the configured admin email.
 * Falls back to false if VITE_ADMIN_EMAIL is not configured.
 */
export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!ADMIN_EMAIL || !email) return false;
  return email === ADMIN_EMAIL;
};
