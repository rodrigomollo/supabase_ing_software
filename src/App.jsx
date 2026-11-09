import { useEffect, useState } from 'react'
import { supabase, faltanVariables } from './supabaseClient'
import Auth from './components/Auth'
import Tareas from './components/Tareas'
import './App.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    // La sesión se guarda en el navegador: sobrevive a recargar la página.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setListo(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (faltanVariables)
    return <main><p className="msg">Falta configurar <code>.env</code> (ver .env.example).</p></main>
  if (!listo) return <main><p>Cargando…</p></main>

  return (
    <main>
      <header>
        <h1>Gestor de tareas</h1>
        {session && (
          <div>
            <small>{session.user.email}</small>{' '}
            <button className="sec" onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
          </div>
        )}
      </header>
      {session ? <Tareas user={session.user} /> : <Auth />}
    </main>
  )
}
