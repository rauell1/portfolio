alter table if exists public.blog_posts
	add column if not exists share_token text,
	add column if not exists share_enabled boolean not null default false,
	add column if not exists share_expires_at timestamptz;

create unique index if not exists idx_blog_posts_share_token
	on public.blog_posts (share_token)
	where share_token is not null;

update public.blog_posts
set share_enabled = false
where share_enabled is null;

update public.blog_posts
set share_expires_at = null
where share_enabled = false;

drop policy if exists "blog_posts_public_read_published" on public.blog_posts;
drop policy if exists "Public can view published blog posts" on public.blog_posts;
drop policy if exists "blog_posts_public_read_shared_only" on public.blog_posts;

create policy "blog_posts_public_read_disabled"
on public.blog_posts
for select
to public
using (false);

drop function if exists public.get_shared_blog_post(text, text);

create or replace function public.get_shared_blog_post(p_slug text, p_token text)
returns table (
	id uuid,
	title text,
	slug text,
	excerpt text,
	content text,
	cover_image text,
	category text,
	tags text[],
	published_at timestamptz,
	created_at timestamptz,
	share_token text,
	share_enabled boolean,
	share_expires_at timestamptz
)
language sql
security definer
set search_path = public
as $$
	select
		bp.id,
		bp.title,
		bp.slug,
		bp.excerpt,
		bp.content,
		bp.cover_image,
		bp.category,
		bp.tags,
		bp.published_at,
		bp.created_at,
		bp.share_token,
		bp.share_enabled,
		bp.share_expires_at
	from public.blog_posts bp
	where bp.slug = p_slug
		and bp.published = true
		and bp.share_enabled = true
		and bp.share_token = p_token
		and (bp.share_expires_at is null or bp.share_expires_at > now())
	limit 1;
$$;

revoke all on function public.get_shared_blog_post(text, text) from public;
grant execute on function public.get_shared_blog_post(text, text) to anon, authenticated;
