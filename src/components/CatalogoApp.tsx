import { useState, useEffect } from "react";
import Filters from "./Filters";
import ProductList from "./ProductList";
import Cart from "./Cart";
import { cargarProductos } from "../utils/csvLoader";
import type { Producto, ItemCarrito } from "../utils/types";

export default function CatalogoApp() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarProductos()
      .then((data) => {
        setProductos(data);
        setProductosFiltrados(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        setError(
          "Error al cargar el catálogo. Verifica que el archivo productos.csv existe en /public/"
        );
        setCargando(false);
      });
  }, []);

  const agregarAlCarrito = (producto: Producto) => {
    const existente = carrito.findIndex(
      (item) =>
        item.producto.sku === producto.sku &&
        item.producto.clave === producto.clave
    );

    if (existente !== -1) {
      const nuevoCarrito = [...carrito];
      nuevoCarrito[existente].cantidad += 1;
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, { producto, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (index: number, cantidad: number) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad = cantidad;
    setCarrito(nuevoCarrito);
  };

  const eliminarDelCarrito = (index: number) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  const limpiarCarrito = () => {
    if (confirm("¿Estás seguro de limpiar todo el carrito?")) {
      setCarrito([]);
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-semibold mb-2">⚠️ Error</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-6">
        <Filters productos={productos} onFilter={setProductosFiltrados} />
        <ProductList
          productos={productosFiltrados}
          onAgregar={agregarAlCarrito}
        />
      </div>
      <Cart
        items={carrito}
        onActualizarCantidad={actualizarCantidad}
        onEliminar={eliminarDelCarrito}
        onLimpiar={limpiarCarrito}
      />
    </div>
  );
}
