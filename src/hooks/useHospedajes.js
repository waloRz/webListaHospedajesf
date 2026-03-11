import { useState, useMemo } from 'react'
import data from '../data/hospedajes.json'

const ACTIVOS = data.filter(h => h.activo)

export function useHospedajes() {

  const [filtros, setFiltros] = useState({
    busqueda:  '',
    categoria: [],
    servicios: [],
    turismo:   [],
  })

  const hospedajesFiltrados = useMemo(() => {
    return ACTIVOS.filter(h => {
      if (filtros.busqueda.trim()) {
        const q = filtros.busqueda.toLowerCase().trim()
        const enNombre      = h.nombre.toLowerCase().includes(q)
        const enDescripcion = h.descripcion.toLowerCase().includes(q)
        const enCategoria   = h.categoria.some(c => c.toLowerCase().includes(q))
        if (!enNombre && !enDescripcion && !enCategoria) return false
      }
      if (filtros.categoria.length > 0) {
        const tieneCategoria = h.categoria.some(c => filtros.categoria.includes(c))
        if (!tieneCategoria) return false
      }
      if (filtros.servicios.length > 0) {
        const tieneTodasLasComodidades = filtros.servicios.every(s => h.servicios.includes(s))
        if (!tieneTodasLasComodidades) return false
      }
      return true
    })
  }, [filtros])

  // Mezcla aleatoria (Fisher-Yates), toma los primeros 4
  // Sin dependencias: orden nuevo en cada visita a la página
  const aleatorios = useMemo(() => {
    const arr = [...ACTIVOS]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, 4)
  }, [])

  function toggleFiltro(campo, valor) {
    setFiltros(prev => {
      const lista = prev[campo]
      const nueva = lista.includes(valor)
        ? lista.filter(v => v !== valor)
        : [...lista, valor]
      return { ...prev, [campo]: nueva }
    })
  }

  function resetFiltros() {
    setFiltros({ busqueda: '', categoria: [], servicios: [], turismo: [] })
  }

  function setBusqueda(texto) {
    setFiltros(prev => ({ ...prev, busqueda: texto }))
  }

  function getById(id) {
    return data.find(h => h.id === id) ?? null
  }

  const contarPorCategoria = useMemo(() => {
    return ACTIVOS.reduce((acc, h) => {
      h.categoria.forEach(c => {
        acc[c] = (acc[c] ?? 0) + 1
      })
      return acc
    }, {})
  }, [])

  const hayFiltrosActivos =
    filtros.busqueda.trim() !== '' ||
    filtros.categoria.length > 0  ||
    filtros.servicios.length > 0

  const cantidadFiltrosActivos =
    (filtros.busqueda.trim() ? 1 : 0) +
    filtros.categoria.length +
    filtros.servicios.length

  return {
    hospedajes:           ACTIVOS,
    hospedajesFiltrados,
    destacados:           ACTIVOS.filter(h => h.destacado),
    aleatorios,
    totalActivos:         ACTIVOS.length,
    contarPorCategoria,
    filtros,
    setFiltros,
    setBusqueda,
    toggleFiltro,
    resetFiltros,
    hayFiltrosActivos,
    cantidadFiltrosActivos,
    getById,
  }
}
