-- ============================================================
-- Redefine get_shared_blog_post to allow sharing drafts.
-- Removes the bp.published = true check, as drafts should be
-- shareable via direct tokens before public publication.
-- ============================================================

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
		and bp.share_enabled = true
		and bp.share_token = p_token
		and (bp.share_expires_at is null or bp.share_expires_at > now())
	limit 1;
$$;

revoke all on function public.get_shared_blog_post(text, text) from public;
grant execute on function public.get_shared_blog_post(text, text) to anon, authenticated;
