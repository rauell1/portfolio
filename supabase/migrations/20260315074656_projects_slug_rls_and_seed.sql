-- ============================================================
-- 1. Add slug column to projects for identifying special projects
--    (e.g. "roam-point") so the frontend can prefer the DB version
--    over any hardcoded fallback.
-- ============================================================
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Enforce uniqueness only on non-null slugs
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_unique
  ON public.projects (slug)
  WHERE slug IS NOT NULL;

-- ============================================================
-- 2. Enable Row Level Security on projects table (if not already)
--    and add appropriate policies.
-- ============================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can view projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'projects' AND policyname = 'Projects are publicly viewable'
  ) THEN
    CREATE POLICY "Projects are publicly viewable"
      ON public.projects
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Admin write: only the site owner can create / update / delete projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'projects' AND policyname = 'Admin can manage projects'
  ) THEN
    CREATE POLICY "Admin can manage projects"
      ON public.projects
      FOR ALL
      USING  (auth.jwt() ->> 'email' = 'royokola3@gmail.com')
      WITH CHECK (auth.jwt() ->> 'email' = 'royokola3@gmail.com');
  END IF;
END $$;

-- ============================================================
-- 3. Add updated_at trigger for projects (if not already present)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_projects_updated_at'
  ) THEN
    CREATE TRIGGER update_projects_updated_at
      BEFORE UPDATE ON public.projects
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- ============================================================
-- 4. Ensure the Roam Point project exists in the database so the
--    admin dashboard can manage it alongside other projects.
--    Only inserts if no project with slug 'roam-point' exists yet.
-- ============================================================
INSERT INTO public.projects (
  slug, title, description, location, project_type, images, completed_at
)
SELECT
  'roam-point',
  'Roam Point EV Charging Infrastructure',
  'Roam Point is a distributed EV charging infrastructure solution designed to accelerate electric motorcycle adoption across African cities by providing accessible and high-speed charging hubs.',
  'Nairobi, Kenya',
  'ev',
  ARRAY['/images/roam-electric.webp', '/images/basigo-charging.png', '/images/basigo-buses.jpeg'],
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects WHERE slug = 'roam-point'
);

-- ============================================================
-- 5. Ensure the blog-covers storage bucket exists for cover image
--    uploads from the AdminPostEditor.
--    (If the bucket was already created via the dashboard this is a no-op.)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-covers', 'blog-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow the admin to upload cover images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND schemaname = 'storage'
      AND policyname = 'Admin can upload blog covers'
  ) THEN
    CREATE POLICY "Admin can upload blog covers"
      ON storage.objects
      FOR INSERT
      WITH CHECK (
        bucket_id = 'blog-covers'
        AND auth.jwt() ->> 'email' = 'royokola3@gmail.com'
      );
  END IF;
END $$;

-- Allow public read of blog cover images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
      AND schemaname = 'storage'
      AND policyname = 'Public can read blog covers'
  ) THEN
    CREATE POLICY "Public can read blog covers"
      ON storage.objects
      FOR SELECT
      USING (bucket_id = 'blog-covers');
  END IF;
END $$;
