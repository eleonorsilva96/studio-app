begin;
create type public.studio_role as enum ('manager', 'teacher', 'student');
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null default '',
 created_at timestamptz not null default now()
);
create table public.organizations (
 id uuid primary key default gen_random_uuid(),
 name text not null check (length(trim(name)) between 2 and 100),
 timezone text not null default 'Europe/Lisbon' check (timezone in ('Europe/Lisbon','Atlantic/Azores','Europe/Madrid')),
 created_by uuid not null references auth.users(id),
 onboarding_step smallint not null default 1 check (onboarding_step between 1 and 6),
 created_at timestamptz not null default now(),
 unique(created_by)
);
create table public.memberships (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade,
 created_at timestamptz not null default now(),
 unique(organization_id, user_id)
);
create index memberships_user_idx on public.memberships(user_id);
create table public.membership_roles (
 membership_id uuid not null references public.memberships(id) on delete cascade,
 role public.studio_role not null,
 primary key(membership_id, role)
);
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.membership_roles enable row level security;
-- Policies intentionally expose only the current person's membership in this foundation.
-- Future team administration must add explicit manager-scoped operations.
create policy own_profile on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy own_membership on public.memberships for select to authenticated using (user_id = (select auth.uid()));
create policy own_roles on public.membership_roles for select to authenticated using (
 exists(select 1 from public.memberships m where m.id = membership_id and m.user_id = (select auth.uid()))
);
create policy own_studio on public.organizations for select to authenticated using (
 exists(select 1 from public.memberships m where m.organization_id = organizations.id and m.user_id = (select auth.uid()))
);
revoke all on public.profiles, public.organizations, public.memberships, public.membership_roles from anon, authenticated;
grant select on public.profiles, public.organizations, public.memberships, public.membership_roles to authenticated;
-- No client can insert roles or memberships, including their own manager role.
create function public.create_studio(studio_name text, studio_timezone text default 'Europe/Lisbon')
returns uuid language plpgsql security definer set search_path = '' as $$
declare person uuid := auth.uid(); studio uuid; member uuid;
begin
 if person is null then raise exception 'Authentication required'; end if;
 if length(trim(studio_name)) not between 2 and 100 or studio_name is null then raise exception 'Invalid name'; end if;
 -- Serializes retries from the same person; creation is atomic and idempotent.
 perform pg_advisory_xact_lock(hashtextextended(person::text, 0));
 select id into studio from public.organizations where created_by = person;
 if studio is not null then return studio; end if;
 if exists(select 1 from public.memberships where user_id = person) then raise exception 'Already associated with a studio'; end if;
 insert into public.profiles(id, full_name)
 select id, left(coalesce(raw_user_meta_data->>'full_name',''),100) from auth.users where id = person
 on conflict(id) do nothing;
 insert into public.organizations(name,timezone,created_by) values(trim(studio_name), studio_timezone, person) returning id into studio;
 insert into public.memberships(organization_id,user_id) values(studio,person) returning id into member;
 insert into public.membership_roles(membership_id,role) values(member,'manager');
 return studio;
end;
$$;
revoke all on function public.create_studio(text,text) from public, anon;
grant execute on function public.create_studio(text,text) to authenticated;
commit;
