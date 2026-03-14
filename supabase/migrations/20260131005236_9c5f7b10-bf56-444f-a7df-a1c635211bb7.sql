-- Add explicit SELECT policy to deny public access to newsletter_subscribers
-- This prevents any accidental exposure of email addresses

CREATE POLICY "No public access to subscriber emails"
ON public.newsletter_subscribers
FOR SELECT
USING (false);