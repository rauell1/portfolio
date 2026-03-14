-- Fix 1: Add UPDATE/DELETE protection for newsletter_subscribers
-- Block all UPDATE/DELETE operations since this is managed through edge functions only

CREATE POLICY "No one can update subscribers"
ON public.newsletter_subscribers
FOR UPDATE
USING (false);

CREATE POLICY "No one can delete subscribers"
ON public.newsletter_subscribers
FOR DELETE
USING (false);

-- Fix 2: Replace overly permissive blog_posts policy with admin-only access
-- Using email whitelist for single admin blog

DROP POLICY IF EXISTS "Authenticated users can manage posts" ON public.blog_posts;

CREATE POLICY "Admin can manage all posts"
ON public.blog_posts
FOR ALL
USING (auth.jwt() ->> 'email' = 'royokola3@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'royokola3@gmail.com');