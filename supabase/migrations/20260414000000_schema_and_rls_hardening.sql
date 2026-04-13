-- ============================================================
-- Schema + RLS hardening migration
-- - Creates missing core tables if prior migrations failed mid-way
-- - Normalizes RLS policies to avoid permissive/duplicate policies
-- - Uses SELECT-wrapped auth.jwt() checks to reduce per-row recomputation
-- ============================================================

-- Ensure timestamp trigger function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ------------------------------------------------------------
-- Ensure projects table exists (was referenced before guaranteed create)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  project_type TEXT NOT NULL DEFAULT 'other',
  images TEXT[] DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';

DO $$
BEGIN
  -- Backfill invalid statuses if any
  UPDATE public.projects
  SET status = 'published'
  WHERE status NOT IN ('published', 'draft', 'archived');

  -- Add status constraint only once
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'projects_status_check'
      AND conrelid = 'public.projects'::regclass
  ) THEN
    ALTER TABLE public.projects
      ADD CONSTRAINT projects_status_check
      CHECK (status IN ('published', 'draft', 'archived'));
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_unique
  ON public.projects (slug)
  WHERE slug IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at'
  ) THEN
    CREATE TRIGGER update_projects_updated_at
      BEFORE UPDATE ON public.projects
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- ------------------------------------------------------------
-- Ensure page_sections table exists (used by homepage CMS)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL DEFAULT 'home',
  section TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (page, section)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_page_sections_updated_at'
  ) THEN
    CREATE TRIGGER update_page_sections_updated_at
      BEFORE UPDATE ON public.page_sections
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- ------------------------------------------------------------
-- RLS enablement
-- ------------------------------------------------------------
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- blog_posts policies
-- ------------------------------------------------------------
DO $$
DECLARE pol RECORD;
BEGIN
  -- Collapse all SELECT policies into one deterministic policy
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'blog_posts'
      AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.blog_posts', pol.policyname);
  END LOOP;

  CREATE POLICY "Published blog posts are publicly readable"
    ON public.blog_posts
    FOR SELECT
    USING (published = true);

  DROP POLICY IF EXISTS "Authenticated users can manage posts" ON public.blog_posts;
  DROP POLICY IF EXISTS "Admin can manage all posts" ON public.blog_posts;

  CREATE POLICY "Admin can manage all posts"
    ON public.blog_posts
    FOR ALL
    USING ((SELECT auth.jwt() ->> 'email') = 'royokola3@gmail.com')
    WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'royokola3@gmail.com');
END $$;

-- ------------------------------------------------------------
-- newsletter_subscribers policies
-- ------------------------------------------------------------
DO $$
DECLARE pol RECORD;
BEGIN
  -- Keep exactly one INSERT policy with basic email sanity checks.
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'newsletter_subscribers'
      AND cmd = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.newsletter_subscribers', pol.policyname);
  END LOOP;

  CREATE POLICY "Public can subscribe to newsletter"
    ON public.newsletter_subscribers
    FOR INSERT
    WITH CHECK (
      email IS NOT NULL
      AND length(email) <= 320
      AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    );

  DROP POLICY IF EXISTS "No public access to subscriber emails" ON public.newsletter_subscribers;
  CREATE POLICY "No public access to subscriber emails"
    ON public.newsletter_subscribers
    FOR SELECT
    USING (false);

  DROP POLICY IF EXISTS "No one can update subscribers" ON public.newsletter_subscribers;
  CREATE POLICY "No one can update subscribers"
    ON public.newsletter_subscribers
    FOR UPDATE
    USING (false);

  DROP POLICY IF EXISTS "No one can delete subscribers" ON public.newsletter_subscribers;
  CREATE POLICY "No one can delete subscribers"
    ON public.newsletter_subscribers
    FOR DELETE
    USING (false);
END $$;

-- ------------------------------------------------------------
-- Normalize admin policies with SELECT-wrapped JWT reads
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
CREATE POLICY "Admin can manage projects"
  ON public.projects
  FOR ALL
  USING ((SELECT auth.jwt() ->> 'email') = 'royokola3@gmail.com')
  WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'royokola3@gmail.com');

DROP POLICY IF EXISTS "Projects are publicly viewable" ON public.projects;
CREATE POLICY "Projects are publicly viewable"
  ON public.projects
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage page sections" ON public.page_sections;
CREATE POLICY "Admin can manage page sections"
  ON public.page_sections
  FOR ALL
  USING ((SELECT auth.jwt() ->> 'email') = 'royokola3@gmail.com')
  WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'royokola3@gmail.com');

DROP POLICY IF EXISTS "Page sections are publicly readable" ON public.page_sections;
CREATE POLICY "Page sections are publicly readable"
  ON public.page_sections
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can manage case studies" ON public.case_studies;
CREATE POLICY "Admin can manage case studies"
  ON public.case_studies
  FOR ALL
  USING ((SELECT auth.jwt() ->> 'email') = 'royokola3@gmail.com')
  WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'royokola3@gmail.com');

DROP POLICY IF EXISTS "Published case studies are publicly viewable" ON public.case_studies;
CREATE POLICY "Published case studies are publicly viewable"
  ON public.case_studies
  FOR SELECT
  USING (published = true);
