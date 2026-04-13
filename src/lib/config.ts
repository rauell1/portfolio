/**
 * Application configuration constants derived from environment variables.
 * Set these in your .env file (see .env.example).
 */

/** The email address that has admin access to the CMS. */
const HARD_CODED_ADMIN_EMAIL = "royokola3@gmail.com";
export const ADMIN_EMAIL =
  ((import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim().toLowerCase() ||
    HARD_CODED_ADMIN_EMAIL);

/**
 * Returns true if the given user email matches the configured admin email.
 * Falls back to the hardcoded owner email if VITE_ADMIN_EMAIL is not configured.
 */
export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
};
