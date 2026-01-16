import { useState } from "react";
import type { ItemCarrito } from "../utils/types";
import { generarPDF } from "../utils/pdfGenerator";

interface CartProps {
  items: ItemCarrito[];
  onActualizarCantidad: (index: number, cantidad: number) => void;
  onEliminar: (index: number) => void;
  onLimpiar: () => void;
}

export default function Cart({
  items,
  onActualizarCantidad,
  onEliminar,
  onLimpiar,
}: CartProps) {
  const [enviando, setEnviando] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

  const handleGenerarCotizacion = async () => {
    if (items.length === 0) return;
    setEnviando(true);

    try {
      // Generar y descargar PDF
      const pdfBlob = generarPDF(items);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cotizacion_${new Date().toLocaleDateString("es-MX")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Preparar y copiar texto para WhatsApp
      const mensaje = `Hola, solicito cotización:\n${items
        .map((i) => `• ${i.producto.descripcion} (${i.cantidad})`)
        .join("\n")}\n\nTotal: $${total.toLocaleString()}`;

      await navigator.clipboard.writeText(mensaje);
      alert("¡Cotización copiada al portapapeles! Puedes pegarla en WhatsApp");
      // O mejor: usar un toast/notification library
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al generar/copiar la cotización");
    } finally {
      setEnviando(false);
    }
  };

  if (items.length === 0)
    return (
      <div className="hidden lg:block p-8 border-2 border-dashed rounded-3xl text-center text-slate-400">
        Carrito vacío
      </div>
    );

  return (
    <>
      Es comprensible, los emojis a veces se ven informales o se pierden
      dependiendo del sistema operativo. Podemos sustituirlo por un icono de
      Lucide React (que es el estándar moderno para React) o usar SVG puro para
      no instalar librerías extra. Aquí tienes la versión mejorada del botón
      flotante usando un SVG estilizado y un diseño más profesional: 1.
      Reemplaza el botón flotante en Cart.tsx Busca la sección del botón y
      reemplázala por este código. He añadido un efecto de gradiente y un icono
      vectorial: TypeScript
      {/* Botón Flotante con Icono SVG */}
      {items.length > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center justify-center"
        >
          {/* Efecto de pulso de fondo */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-20"></span>

          <div className="relative bg-linear-to-br from-blue-600 to-blue-700 text-white w-16 h-16 rounded-2xl shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>

            {/* Contador de productos */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
              {items.reduce((acc, item) => acc + item.cantidad, 0)}
            </span>
          </div>
        </button>
      )}
      {/* OVERLAY (Fondo oscuro al abrir) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* PANEL DEL CARRITO */}
      <div
        className={`
          fixed top-0 right-0 z-70 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out
          w-full sm:w-100 
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
      >
        {/* HEADER */}
        <div className="p-5 border-b-2 border-blue-500/40 flex justify-between items-center bg-white">
          <h3 className="font-bold text-slate-900">
            Tu Cotización ({items.length})
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* LISTA (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {items.length === 0 ? (
            <p className="text-center text-slate-400 mt-10">
              Tu carrito está vacío
            </p>
          ) : (
            items.map((item, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm"
              >
                <p className="text-xs font-bold text-slate-800 mb-2 line-clamp-2">
                  {item.producto.descripcion}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-blue-300 rounded-lg bg-blue-50/60">
                    <button
                      onClick={() =>
                        onActualizarCantidad(
                          index,
                          Math.max(1, item.cantidad - 1)
                        )
                      }
                      className="px-3 py-1 text-blue-600"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-blue-700">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() =>
                        onActualizarCantidad(index, item.cantidad + 1)
                      }
                      className="px-3 py-1 text-blue-600"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-blue-600">
                      ${(item.producto.precio * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onEliminar(index)}
                    className="ml-3 text-slate-300 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t-2 border-blue-500/40">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase">
                Total Estimado
              </span>
              <span className="text-2xl font-black text-blue-500">
                ${total.toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleGenerarCotizacion}
              disabled={enviando || items.length === 0}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              {enviando ? "Generando..." : "📄 Generar Cotización (PDF)"}
            </button>
            <button
              onClick={onLimpiar}
              className="w-full mt-3 text-slate-400 text-xs hover:text-red-500 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
