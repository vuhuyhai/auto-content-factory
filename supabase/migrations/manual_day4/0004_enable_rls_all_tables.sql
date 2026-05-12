-- Migration: enable_rls_all_tables (combined 3 migrations)
-- Applied to production: 2026-05-12 (Day 4)
-- Pushed via Supabase MCP apply_migration (3 separate waves: profiles, brands+subscriptions, workflows+contents+content_logs)
-- Result: 6/6 tables RLS enabled, 16 policies total

-- WAVE 7A: profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- WAVE 7B: brands + subscriptions
alter table public.brands enable row level security;

create policy "Users can view own brands"
  on public.brands for select
  using (auth.uid() = user_id);

create policy "Users can insert own brands"
  on public.brands for insert
  with check (auth.uid() = user_id);

create policy "Users can update own brands"
  on public.brands for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own brands"
  on public.brands for delete
  using (auth.uid() = user_id);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- WAVE 7C: workflows + contents + content_logs (using denormalized brand_id for 1-hop)
alter table public.workflows enable row level security;

create policy "Users can view own workflows"
  on public.workflows for select
  using (exists (select 1 from public.brands b where b.id = workflows.brand_id and b.user_id = auth.uid()));

create policy "Users can insert own workflows"
  on public.workflows for insert
  with check (exists (select 1 from public.brands b where b.id = workflows.brand_id and b.user_id = auth.uid()));

create policy "Users can update own workflows"
  on public.workflows for update
  using (exists (select 1 from public.brands b where b.id = workflows.brand_id and b.user_id = auth.uid()))
  with check (exists (select 1 from public.brands b where b.id = workflows.brand_id and b.user_id = auth.uid()));

create policy "Users can delete own workflows"
  on public.workflows for delete
  using (exists (select 1 from public.brands b where b.id = workflows.brand_id and b.user_id = auth.uid()));

alter table public.contents enable row level security;

create policy "Users can view own contents"
  on public.contents for select
  using (exists (select 1 from public.brands b where b.id = contents.brand_id and b.user_id = auth.uid()));

create policy "Users can insert own contents"
  on public.contents for insert
  with check (exists (select 1 from public.brands b where b.id = contents.brand_id and b.user_id = auth.uid()));

create policy "Users can update own contents"
  on public.contents for update
  using (exists (select 1 from public.brands b where b.id = contents.brand_id and b.user_id = auth.uid()))
  with check (exists (select 1 from public.brands b where b.id = contents.brand_id and b.user_id = auth.uid()));

create policy "Users can delete own contents"
  on public.contents for delete
  using (exists (select 1 from public.brands b where b.id = contents.brand_id and b.user_id = auth.uid()));

alter table public.content_logs enable row level security;

create policy "Users can view own content logs"
  on public.content_logs for select
  using (exists (select 1 from public.brands b where b.id = content_logs.brand_id and b.user_id = auth.uid()));
