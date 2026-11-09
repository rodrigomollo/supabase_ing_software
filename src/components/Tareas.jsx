import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const ESTADOS = ['pendiente', 'en_progreso', 'completada']

export default function Tareas({ user }) {
  const [tareas, setTareas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState('pendiente')
  const [editando, setEditando] = useState(null) // id de la tarea en edición
  const [error, setError] = useState('')

  // CONSULTAR (Read). RLS hace que solo lleguen las tareas del usuario.
  async function cargar() {
    const { data, error } = await supabase
      .from('tareas')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setTareas(data)
  }

  useEffect(() => { cargar() }, [])

  function limpiar() {
    setTitulo(''); setDescripcion(''); setEstado('pendiente'); setEditando(null)
  }

  // CREAR (Create) o MODIFICAR (Update) según si hay una tarea en edición.
  async function guardar(e) {
    e.preventDefault()
    setError('')
    if (!titulo.trim()) return setError('El título no puede estar vacío')
    const datos = { titulo: titulo.trim(), descripcion, estado }
    const { error } = editando
      ? await supabase.from('tareas').update(datos).eq('id', editando)
      : await supabase.from('tareas').insert({ ...datos, user_id: user.id })
    if (error) return setError(error.message)
    limpiar()
    cargar()
  }

  function editar(t) {
    setEditando(t.id); setTitulo(t.titulo); setDescripcion(t.descripcion ?? ''); setEstado(t.estado)
  }

  // ELIMINAR (Delete)
  async function eliminar(id) {
    const { error } = await supabase.from('tareas').delete().eq('id', id)
    if (error) setError(error.message)
    else cargar()
  }

  return (
    <>
      <form onSubmit={guardar} className="card">
        <h2>{editando ? 'Editar tarea' : 'Nueva tarea'}</h2>
        <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <textarea placeholder="Descripción" value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)} />
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          {ESTADOS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <div className="row">
          <button>{editando ? 'Guardar cambios' : 'Agregar'}</button>
          {editando && <button type="button" className="sec" onClick={limpiar}>Cancelar</button>}
        </div>
        {error && <p className="msg">{error}</p>}
      </form>

      <h2>Mis tareas ({tareas.length})</h2>
      {tareas.length === 0 && <p>No tienes tareas todavía.</p>}
      <ul className="lista">
        {tareas.map((t) => (
          <li key={t.id} className="card">
            <strong>{t.titulo}</strong> <span className={`tag ${t.estado}`}>{t.estado.replace('_', ' ')}</span>
            <p>{t.descripcion}</p>
            <div className="row">
              <button className="sec" onClick={() => editar(t)}>Editar</button>
              <button className="danger" onClick={() => eliminar(t.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
