-- Migration: fix_handle_new_user_use_name_column
-- Applied to production: 2026-05-12 (Day 4)
-- Pushed via Supabase MCP apply_migration
-- Purpose: Fix trigger to use 'name' column (real schema) instead of 'full_name' (assumption)

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url, created_at, updated_at)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      null
    ),
    new.raw_user_meta_data->>'avatar_url',
    now(),
    now()
  );
  return new;
end;
$$;
