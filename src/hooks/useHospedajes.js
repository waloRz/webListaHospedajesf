/**
 * useHospedajes — src/hooks/useHospedajes.js
 *
 * Hook central de la aplicación. Maneja:
 *   - Estado de todos los filtros (búsqueda, categoría, servicios, turismo)
 *   - Lista filtrada derivada con useMemo (no recalcula si filtros no cambiaron)
 *   - Helpers: toggleFiltro, resetFiltros, getById, contarPorCategoria
 *
 * Se puede instanciar en múltiples componentes sin problema porque
 * cada llamada crea su propio estado local. Si en el futuro necesitás
 * compartir filtros entre componentes hermanos, elevá el estado al padre
 * y pasá filtros/setFiltros como props, o usá Context API.
 */
import { useState, useMemo } from 'react'
import data from '../data/hospedajes.json'

// Solo los activos se exponen al exterior
const ACTIVOS = data.filter(h => h.activo)

export function useHospedajes() {

  // ── Estado de filtros ────────────────────────────────────────────────────
  // Cada campo es independiente; se combinan con lógica AND entre grupos
  // y lógica OR dentro de cada grupo (excepto servicios que es AND).
  const [filtros, setFiltros] = useState({
    busqueda:  '',   // string libre — filtra nombre + descripción
    categoria: [],   // string[] — OR: muestra si pertenece A ALGUNA categoría seleccionada
    servicios: [],   // string[] — AND: muestra solo si tiene TODOS los servicios seleccionados
    turismo:   [],   // string[] — OR: muestra si pertenece A ALGÚN tipo de turismo seleccionado
  })

  // ── Lista filtrada (memoizada) ───────────────────────────────────────────
  const hospedajesFiltrados = useMemo(() => {
    return ACTIVOS.filter(h => {

      // 1. BÚSQUEDA LIBRE — nombre o descripción contienen el texto
      if (filtros.busqueda.trim()) {
        const q = filtros.busqueda.toLowerCase().trim()
        const enNombre      = h.nombre.toLowerCase().includes(q)
        const enDescripcion = h.descripcion.toLowerCase().includes(q)
        const enCategoria   = h.categoria.toLowerCase().includes(q)
        if (!enNombre && !enDescripcion && !enCategoria) return false
      }

      // 2. CATEGORÍA — OR: si hay seleccionadas, el hospedaje debe estar en alguna
      if (filtros.categoria.length > 0) {
        if (!filtros.categoria.includes(h.categoria)) return false
      }

      // 3. SERVICIOS — AND: el hospedaje debe tener TODOS los servicios marcados
      if (filtros.servicios.length > 0) {
        const tieneTodasLasComodidades = filtros.servicios.every(s =>
          h.servicios.includes(s)
        )
        if (!tieneTodasLasComodidades) return false
      }

      // 4. TURISMO — OR: al menos uno de los tipos seleccionados debe coincidir
      if (filtros.turismo.length > 0) {
        const tieneAlgunTipo = filtros.turismo.some(t =>
          h.categorias_turismo.includes(t)
        )
        if (!tieneAlgunTipo) return false
      }

      return true
    })
  }, [filtros])

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Agrega o quita un valor de un campo array del estado de filtros */
  function toggleFiltro(campo, valor) {
    setFiltros(prev => {
      const lista = prev[campo]
      const nueva = lista.includes(valor)
        ? lista.filter(v => v !== valor)   // quitar
        : [...lista, valor]                // agregar
      return { ...prev, [campo]: nueva }
    })
  }

  /** Resetea todos los filtros a su estado inicial */
  function resetFiltros() {
    setFiltros({ busqueda: '', categoria: [], servicios: [], turismo: [] })
  }

  /** Actualiza solo el campo de búsqueda libre */
  function setBusqueda(texto) {
    setFiltros(prev => ({ ...prev, busqueda: texto }))
  }

  /** Busca un hospedaje por id en los datos originales */
  function getById(id) {
    return data.find(h => h.id === id) ?? null
  }

  /**
   * Cuenta cuántos hospedajes activos hay por categoría.
   * Útil para mostrar "(3)" junto a cada filtro de categoría.
   * @returns {Object} { 'hostería': 2, 'cabaña': 1, ... }
   */
  const contarPorCategoria = useMemo(() => {
    return ACTIVOS.reduce((acc, h) => {
      acc[h.categoria] = (acc[h.categoria] ?? 0) + 1
      return acc
    }, {})
  }, [])

  // ── Derivados de estado ──────────────────────────────────────────────────
  const hayFiltrosActivos =
    filtros.busqueda.trim() !== '' ||
    filtros.categoria.length > 0  ||
    filtros.servicios.length > 0  ||
    filtros.turismo.length > 0

  const cantidadFiltrosActivos =
    (filtros.busqueda.trim() ? 1 : 0) +
    filtros.categoria.length +
    filtros.servicios.length +
    filtros.turismo.length

  return {
    // Datos
    hospedajes:           ACTIVOS,
    hospedajesFiltrados,
    destacados:           ACTIVOS.filter(h => h.destacado),
    totalActivos:         ACTIVOS.length,
    contarPorCategoria,

    // Estado de filtros
    filtros,
    setFiltros,
    setBusqueda,
    toggleFiltro,
    resetFiltros,
    hayFiltrosActivos,
    cantidadFiltrosActivos,

    // Acceso individual
    getById,
  }
}
