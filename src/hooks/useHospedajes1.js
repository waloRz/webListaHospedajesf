import { useState, useMemo } from 'react'
import data from '../data/hospedajes.json'

export function useHospedajes() {
  const [filtros, setFiltros] = useState({
    categoria: [],
    servicios: [],
    turismo: [],
    busqueda: '',
  })

  const hospedajesFiltrados = useMemo(() => {
    return data
      .filter(h => h.activo)
      .filter(h => {
        if (filtros.categoria.length > 0 && !filtros.categoria.includes(h.categoria)) return false
        if (filtros.servicios.length > 0 && !filtros.servicios.every(s => h.servicios.includes(s))) return false
        if (filtros.turismo.length > 0 && !filtros.turismo.some(t => h.categorias_turismo.includes(t))) return false
        if (filtros.busqueda.trim()) {
          const q = filtros.busqueda.toLowerCase()
          if (!h.nombre.toLowerCase().includes(q) && !h.descripcion.toLowerCase().includes(q)) return false
        }
        return true
      })
  }, [filtros])

  function getById(id) { return data.find(h => h.id === id) ?? null }

  function toggleFiltro(campo, valor) {
    setFiltros(prev => {
      const actual = prev[campo]
      return { ...prev, [campo]: actual.includes(valor) ? actual.filter(v => v !== valor) : [...actual, valor] }
    })
  }

  function resetFiltros() {
    setFiltros({ categoria: [], servicios: [], turismo: [], busqueda: '' })
  }

  return {
    hospedajes: data.filter(h => h.activo),
    hospedajesFiltrados,
    filtros, setFiltros, toggleFiltro, resetFiltros, getById,
    totalActivos: data.filter(h => h.activo).length,
    destacados: data.filter(h => h.activo && h.destacado),
  }
}
