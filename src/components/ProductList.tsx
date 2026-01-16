import { useState } from "react";
import type { Producto } from "../utils/types";

interface ProductListProps {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
}

type SortKey = keyof Producto | "precio"; // "precio" es numérico, los demás string
type SortDirection = "asc" | "desc";

export default function ProductList({
  productos,
  onAgregar,
}: ProductListProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);

  // Función para ordenar los productos
  const sortedProductos = [...productos].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;

    let aValue: any = a[key as keyof Producto];
    let bValue: any = b[key as keyof Producto];

    // Tratamiento especial para precio (numérico)
    if (key === "precio") {
      aValue = Number(a.precio);
      bValue = Number(b.precio);
    }
    // Tratamiento para strings (case insensitive)
    else if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "asc";

    // Si ya está ordenado por esta columna, cambiamos dirección
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-slate-600 text-lg">
          No se encontraron productos con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleSort("clave")}
              >
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  Clave
                  <span className="text-xs opacity-70 shrink-0">
                    {sortConfig?.key === "clave"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </div>
              </th>

              <th
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleSort("descripcion")}
              >
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  Descripción
                  <span className="text-xs opacity-70 shrink-0">
                    {sortConfig?.key === "descripcion"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </div>
              </th>

              <th
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleSort("principioActivo")}
              >
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  Principio Activo
                  <span className="text-xs opacity-70 shrink-0">
                    {sortConfig?.key === "principioActivo"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </div>
              </th>

              <th
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleSort("laboratorio")}
              >
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  Laboratorio
                  <span className="text-xs opacity-70 shrink-0">
                    {sortConfig?.key === "laboratorio"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </div>
              </th>

              <th
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleSort("categoria")}
              >
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  Categoría
                  <span className="text-xs opacity-70 shrink-0">
                    {sortConfig?.key === "categoria"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </div>
              </th>

              <th
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleSort("iva")}
              >
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  Categoría
                  <span className="text-xs opacity-70 shrink-0">
                    {sortConfig?.key === "iva"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </div>
              </th>

              <th
                className="px-4 py-3 text-right text-sm font-semibold cursor-pointer hover:bg-blue-700 transition"
                onClick={() => handleSort("precio")}
              >
                <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                  Precio
                  <span className="text-xs opacity-70 shrink-0">
                    {sortConfig?.key === "precio"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : "↕"}
                  </span>
                </div>
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedProductos.map((producto, index) => (
              <tr
                key={`${producto.sku}-${producto.clave}-${index}`}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-slate-600">
                  {producto.clave}
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 font-medium">
                  {producto.descripcion}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {producto.principioActivo}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {producto.laboratorio}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {producto.categoria}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 text-center">
                  {producto.iva}
                </td>
                <td className="px-4 py-3 text-sm text-slate-800 font-semibold text-right">
                  $
                  {producto.precio.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onAgregar(producto)}
                    className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
                  >
                    Agregar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          Mostrando{" "}
          <span className="font-semibold">{sortedProductos.length}</span>{" "}
          productos
        </p>
      </div>
    </div>
  );
}
