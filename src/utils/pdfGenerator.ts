import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ItemCarrito } from "./types";

export function generarPDF(items: ItemCarrito[]): Blob {
  const doc = new jsPDF();
  const primaryColor: [number, number, number] = [30, 64, 175]; // Azul Kanek
  const secondaryColor: [number, number, number] = [100, 100, 100];
  const accentColor: [number, number, number] = [240, 249, 255]; // Azul muy claro para fondos

  // 1. Elementos Decorativos de Marca
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 5, 297, "F"); // Barra lateral decorativa

  // 2. Encabezado (Header)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Kanek Med", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("Soluciones en Medicamentos", 20, 31);

  // Cuadro de información de cotización (Derecha)
  doc.setFontSize(9);
  doc.text(`Folio: #COT-${Math.floor(Date.now() / 10000)}`, 150, 20);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-MX")}`, 150, 25);
  doc.text(
    `Vence: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
      "es-MX"
    )}`,
    150,
    30
  );

  doc.setDrawColor(230, 230, 230);
  doc.line(20, 40, 190, 40); // Línea divisora

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("RESUMEN DE COTIZACIÓN", 20, 50);

  // 3. Tabla de Productos
  const tableData = items.map((item) => [
    item.producto.clave,
    item.producto.descripcion,
    item.producto.laboratorio,
    item.cantidad.toString(),
    `$${item.producto.precio.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
    `$${(item.producto.precio * item.cantidad).toLocaleString("es-MX", {
      minimumFractionDigits: 2,
    })}`,
  ]);

  autoTable(doc, {
    startY: 55,
    head: [
      [
        "Clave",
        "Descripción",
        "Laboratorio",
        "Cant.",
        "P. Unitario",
        "Subtotal",
      ],
    ],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 20 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 35 },
      3: { halign: "center", cellWidth: 15 },
      4: { halign: "right", cellWidth: 25 },
      5: { halign: "right", cellWidth: 25, fontStyle: "bold" },
    },
    alternateRowStyles: {
      fillColor: accentColor,
    },
  });

  // 4. Sección de Totales
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const total = items.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

  // Cuadro de Total destacado
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(140, finalY, 50, 12, "F");

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL", 145, finalY + 7.5);
  doc.text(
    `$${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
    185,
    finalY + 7.5,
    { align: "right" }
  );

  // 5. Términos y Condiciones
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("Términos y condiciones:", 20, finalY + 5);
  doc.text(
    "1. Precios sujetos a cambios sin previo aviso y disponibilidad de stock.",
    20,
    finalY + 10
  );
  doc.text(
    "2. Esta cotización no representa un apartado de producto.",
    20,
    finalY + 14
  );
  doc.text(
    "3. Para confirmar su pedido, favor de contactar a su asesor de ventas.",
    20,
    finalY + 18
  );

  // 6. Pie de Página (Footer)
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(20, pageHeight - 20, 190, pageHeight - 20);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Kanek Med S.A. de C.V. | Pachuca, Hidalgo, México",
    105,
    pageHeight - 15,
    { align: "center" }
  );
  doc.text(
    "Contacto: Tel: +52 771 410 8656",
    105,
    pageHeight - 11,
    { align: "center" }
  );

  return doc.output("blob");
}
