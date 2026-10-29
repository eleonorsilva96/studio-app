begin;
insert into auth.users(id) values ('10000000-0000-0000-0000-000000000001'),('20000000-0000-0000-0000-000000000002');
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',true);
select public.create_studio('Estúdio A');
select public.create_studio('Estúdio A');
select set_config('request.jwt.claim.sub','20000000-0000-0000-0000-000000000002',true);
select public.create_studio('Estúdio B');
do $$ begin
 if (select count(*) from public.organizations) <> 1 then raise exception 'Isolation failed'; end if;
 if exists(select 1 from public.organizations where name = 'Estúdio A') then raise exception 'Cross studio read'; end if;
 if (select count(*) from public.memberships) <> 1 then raise exception 'Membership isolation failed'; end if;
 if (select count(*) from public.membership_roles) <> 1 then raise exception 'Role isolation failed'; end if;
 begin
  insert into public.membership_roles select id,'teacher'::public.studio_role from public.memberships;
  raise exception 'Role escalation allowed';
 exception when insufficient_privilege then null;
 end;
end $$;
reset role;
do $$ begin
 if (select count(*) from public.organizations where created_by in ('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002')) <> 2 then raise exception 'Idempotency failed'; end if;
end $$;
rollback;
