-- =====================================================================
-- AgroApp — Fix migración 0003
-- Corrige recursión infinita en RLS de profiles.
-- Causa: las helper functions consultaban public.profiles, que tiene RLS,
-- que vuelve a llamar la helper function → loop infinito → "stack depth exceeded".
-- Fix: marcar las funciones como SECURITY DEFINER (corren con privilegios del
-- owner y saltan RLS al hacer la consulta interna).
-- =====================================================================

create or replace function public.current_profile() returns public.profiles
language sql stable security definer set search_path = public as $$
  select * from public.profiles where id = auth.uid();
$$;

create or replace function public.current_rol() returns text
language sql stable security definer set search_path = public as $$
  select rol from public.profiles where id = auth.uid();
$$;

create or replace function public.current_productor_id() returns uuid
language sql stable security definer set search_path = public as $$
  select case
    when p.rol = 'productor' then p.id
    else p.productor_id
  end
  from public.profiles p where p.id = auth.uid();
$$;

create or replace function public.can_access_parcela(p_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.parcelas p
    where p.id = p_id
      and (
        p.productor_id = public.current_productor_id()
        or public.current_rol() = 'staff'
        or exists (
          select 1 from public.parcela_asignaciones a
          where a.parcela_id = p.id and a.user_id = auth.uid()
        )
      )
  );
$$;

-- Revocar EXECUTE público y dárselo solo a authenticated (buena práctica con SECURITY DEFINER)
revoke execute on function public.current_profile()        from public;
revoke execute on function public.current_rol()            from public;
revoke execute on function public.current_productor_id()   from public;
revoke execute on function public.can_access_parcela(uuid) from public;
grant  execute on function public.current_profile()        to authenticated;
grant  execute on function public.current_rol()            to authenticated;
grant  execute on function public.current_productor_id()   to authenticated;
grant  execute on function public.can_access_parcela(uuid) to authenticated;
