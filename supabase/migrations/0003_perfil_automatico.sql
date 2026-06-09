-- =====================================================================
-- AgroApp — Migración 0003 (M1)
-- Cuando se crea una cuenta nueva (auth.users), se genera automáticamente
-- su perfil en public.profiles, tomando nombre y rol de los datos del alta.
-- Así el ROL se fija al CREAR la cuenta (no se elige en el login).
-- =====================================================================

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nombre, rol, subrol, telefono)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'rol', 'productor'),
    new.raw_user_meta_data->>'subrol',
    new.raw_user_meta_data->>'telefono'
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
