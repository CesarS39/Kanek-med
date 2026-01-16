export interface Producto {
  clave: string;
  descripcion: string;
  principioActivo: string;
  laboratorio: string;
  iva: string;
  sku: string;
  precio: number;
  categoria: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}