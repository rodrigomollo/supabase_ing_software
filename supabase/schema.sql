-- ============================================================
-- Tabla de tareas + Row Level Security
-- Ejecutar en Supabase: SQL Editor > New query > Run
-- ============================================================

create table public.tareas (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null check (length(trim(titulo)) > 0),
  descripcion text,
  estado      text not null default 'pendiente'
              check (estado in ('pendiente', 'en_progreso', 'completada')),
  -- usuario responsable: referencia a la tabla de usuarios de Supabase Auth
  user_id     uuid not null references auth.users (id) on delete cascade
              default auth.uid(),
  created_at  timestamptz not null default now()
);

-- 1) Activar RLS: sin políticas, nadie puede leer ni escribir.
alter table public.tareas enable row level security;

-- 2) Políticas: cada usuario solo ve y modifica sus propias filas.
create policy "Ver mis tareas"
  on public.tareas for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Crear mis tareas"
  on public.tareas for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Modificar mis tareas"
  on public.tareas for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Eliminar mis tareas"
  on public.tareas for delete
  to authenticated
  using (auth.uid() = user_id);
