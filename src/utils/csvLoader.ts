import Papa from "papaparse";
import type { Producto } from "./types";

export async function cargarProductos(): Promise<Producto[]> {
  const response = await fetch("/productos.csv");
  const csvText = await response.text();

  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const productos = results.data.map((row: any) => {
          const precioLimpio =
            row.PRECIO?.toString().replace(/[$,]/g, "") || "0";

          return {
            clave: row.Clave?.trim() || "",
            descripcion: row.Descripción?.trim() || "",
            principioActivo: row["Principio Activo"]?.trim() || "",
            laboratorio: row.Laboratorio?.trim() || "",
            iva: row.IVA?.trim() || "",
            sku: row.SKU?.trim() || "",
            precio: parseFloat(precioLimpio) || 0,
            categoria: row.Categoria?.trim() || "",
          };
        });

        // Eliminar duplicados por SKU y Clave
        const unicos = eliminarDuplicados(productos);
        resolve(unicos);
      },
    });
  });
}

function eliminarDuplicados(productos: Producto[]): Producto[] {
  const mapa = new Map<string, Producto>();

  productos.forEach((producto) => {
    const key = `${producto.sku}-${producto.clave}`;
    if (!mapa.has(key)) {
      mapa.set(key, producto);
    }
  });

  return Array.from(mapa.values());
}
