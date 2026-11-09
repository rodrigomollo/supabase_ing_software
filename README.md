# Gestor de tareas con Supabase (Grupo 3)

App React + Vite con autenticación (email/contraseña) y tareas guardadas en Supabase.
Cada usuario solo ve y modifica sus propias tareas gracias a Row Level Security (RLS).

## Requisitos previos
- Node.js 18+ y npm
- Cuenta gratuita en https://supabase.com

## 1. Crear el proyecto y la tabla
1. En Supabase: **New project** (anota la contraseña de la BD, no se usa en la app).
2. Abre **SQL Editor > New query**, pega el contenido de `supabase/schema.sql` y pulsa **Run**.
3. Comprueba en **Table Editor** que existe `tareas` con el candado de RLS activo.

## 2. Configurar la conexión
1. En Supabase: **Project Settings > API**. Copia **Project URL** y la clave **anon / publishable**.
2. Copia `.env.example` a `.env` y completa:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anon
   ```
3. La conexión se crea en `src/supabaseClient.js`, que lee esas variables.
   **Nunca** uses la clave `service_role` ni subas `.env` (ya está en `.gitignore`).

## 3. Cuentas de prueba
En **Authentication > Providers > Email**, desactiva *Confirm email* para probar sin correos.
Luego crea dos cuentas desde la app con "Regístrate" (por ejemplo `usuario1@test.com` y `usuario2@test.com`, contraseña de 6+ caracteres).

## 4. Ejecutar
```bash
npm install
npm run dev
```
Abre la URL que muestra la consola (normalmente http://localhost:5173).

## Qué demostrar
- Registro, inicio y cierre de sesión; la sesión sobrevive a recargar.
- Crear, listar, editar y eliminar tareas; los datos persisten al recargar.
- RLS con dos cuentas: usuario 2 no ve las tareas de usuario 1.
  En **Table Editor** se ven las filas de ambos (el panel admin ignora RLS), pero la app solo muestra las propias.
- Prueba opcional: desactiva RLS en la tabla y verás que ambos usuarios ven todo.

## Políticas de acceso (resumen)
| Operación | Política | Condición |
|---|---|---|
| SELECT | Ver mis tareas | `auth.uid() = user_id` |
| INSERT | Crear mis tareas | `auth.uid() = user_id` (with check) |
| UPDATE | Modificar mis tareas | `auth.uid() = user_id` |
| DELETE | Eliminar mis tareas | `auth.uid() = user_id` |

`auth.uid()` devuelve el id del usuario que hizo la petición (viene en su token de sesión).

## Errores frecuentes
- **"Falta configurar .env"**: no existe `.env` o reiniciaste sin `npm run dev` de nuevo; Vite lee el `.env` solo al iniciar.
- **"Invalid API key"**: copiaste mal la clave o usaste otra distinta de la anon.
- **"new row violates row-level security policy"**: `user_id` no coincide con el usuario logueado.
- **Lista vacía tras crear tareas**: RLS activo y sin políticas de SELECT (revisa que ejecutaste todo el SQL).
- **"Email not confirmed"**: desactiva *Confirm email* o confirma el correo.
- **"Email rate limit exceeded"**: espera unos minutos o crea las cuentas desde Authentication > Users.
