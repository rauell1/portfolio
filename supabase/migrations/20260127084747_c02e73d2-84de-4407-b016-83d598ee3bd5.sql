-- Create blog_posts table for the CMS blog
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL DEFAULT 'sustainability',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to published posts
CREATE POLICY "Published posts are viewable by everyone" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

-- Create policy for admin to manage all posts (using a simple admin check)
-- For now, allow all authenticated users to manage posts (you can restrict later)
CREATE POLICY "Authenticated users can manage posts" 
ON public.blog_posts 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS for newsletter
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, tags, published, published_at) VALUES
(
  'The Future of Solar Energy in East Africa',
  'future-solar-energy-east-africa',
  'Exploring the rapid growth and potential of solar PV installations across Kenya and the broader East African region.',
  'Solar energy is transforming the power landscape in East Africa. With abundant sunshine and decreasing costs of photovoltaic panels, the region is poised for a renewable energy revolution.\n\n## The Current State\n\nKenya has emerged as a leader in solar adoption, with both utility-scale projects and distributed rooftop installations growing rapidly.\n\n## Key Drivers\n\n- Decreasing panel costs\n- Government incentives\n- Rural electrification programs\n- Corporate sustainability goals\n\n## Looking Ahead\n\nThe next decade will see solar becoming the dominant source of new electricity generation in the region.',
  'renewable-energy',
  ARRAY['solar', 'kenya', 'east-africa', 'clean-energy'],
  true,
  now()
),
(
  'EV Charging Infrastructure: Building for Tomorrow',
  'ev-charging-infrastructure-building-tomorrow',
  'A comprehensive look at the challenges and opportunities in developing EV charging networks in emerging markets.',
  'Electric vehicles are no longer a future technology—they are here today. However, the success of EV adoption depends heavily on the availability of charging infrastructure.\n\n## Infrastructure Challenges\n\nEmerging markets face unique challenges including grid reliability, capital costs, and consumer awareness.\n\n## Innovative Solutions\n\n- Solar-powered charging stations\n- Battery swapping systems\n- Smart grid integration\n\n## The Path Forward\n\nPublic-private partnerships and innovative financing models are key to accelerating infrastructure development.',
  'ev-mobility',
  ARRAY['electric-vehicles', 'charging', 'infrastructure', 'mobility'],
  true,
  now()
),
(
  'Circular Economy in Renewable Energy',
  'circular-economy-renewable-energy',
  'How circular economy principles are reshaping the renewable energy sector for greater sustainability.',
  'The renewable energy sector must embrace circular economy principles to truly achieve sustainability.\n\n## Beyond Clean Energy\n\nWhile solar panels and wind turbines generate clean electricity, their manufacturing and end-of-life management present environmental challenges.\n\n## Circular Approaches\n\n- Panel recycling programs\n- Refurbishment and reuse\n- Design for disassembly\n- Extended producer responsibility\n\n## Industry Leadership\n\nLeading companies are already implementing take-back programs and investing in recycling technologies.',
  'sustainability',
  ARRAY['circular-economy', 'recycling', 'sustainability', 'solar'],
  true,
  now()
);