import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modo, setModo] = useState('login') // 'login' | 'registro'
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setCargando(true)
    setMensaje('')
    const { error } =
      modo === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
    if (error) setMensaje(error.message)
    else if (modo === 'registro')
      setMensaje('Cuenta creada. Si tu proyecto pide confirmación, revisa tu correo.')
    setCargando(false)
  }

  return (
    <form onSubmit={enviar} className="card">
      <h2>{modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
      <input type="email" placeholder="Correo" value={email}
        onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña (mín. 6)" value={password}
        onChange={(e) => setPassword(e.target.value)} minLength={6} required />
      <button disabled={cargando}>{modo === 'login' ? 'Entrar' : 'Registrarme'}</button>
      {mensaje && <p className="msg">{mensaje}</p>}
      <p className="link" onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}>
        {modo === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </p>
    </form>
  )
}
