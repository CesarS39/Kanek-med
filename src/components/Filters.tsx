import { useState, useEffect } from "react";
import type { Producto } from "../utils/types";

interface FiltersProps {
  productos: Producto[];
  onFilter: (filtered: Producto[]) => void;
}

export default function Filters({ productos, onFilter }: FiltersProps) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [laboratorio, setLaboratorio] = useState("");

  const categorias = [...new Set(productos.map((p) => p.categoria))]
    .filter(Boolean)
    .sort();
  const laboratorios = [...new Set(productos.map((p) => p.laboratorio))]
    .filter(Boolean)
    .sort();

  useEffect(() => {
    let filtrados = productos;

    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      filtrados = filtrados.filter(
        (p) =>
          p.descripcion.toLowerCase().includes(busquedaLower) ||
          p.clave.toLowerCase().includes(busquedaLower) ||
          p.principioActivo.toLowerCase().includes(busquedaLower) ||
          p.sku.toLowerCase().includes(busquedaLower)
      );
    }

    if (categoria) {
      filtrados = filtrados.filter((p) => p.categoria === categoria);
    }

    if (laboratorio) {
      filtrados = filtrados.filter((p) => p.laboratorio === laboratorio);
    }

    onFilter(filtrados);
  }, [busqueda, categoria, laboratorio, productos]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoria("");
    setLaboratorio("");
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
          Panel de Búsqueda
        </h2>
        <button
          onClick={limpiarFiltros}
          className="text-slate-400 hover:text-blue-600 text-sm font-semibold transition-colors flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reiniciar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Búsqueda general */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Nombre o Clave
          </label>
          <input
            type="text"
            placeholder="Ej: Paracetamol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Categoría
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Laboratorio */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
            Laboratorio
          </label>
          <select
            value={laboratorio}
            onChange={(e) => setLaboratorio(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none appearance-none"
          >
            <option value="">Todos los laboratorios</option>
            {laboratorios.map((lab) => (
              <option key={lab} value={lab}>
                {lab}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
