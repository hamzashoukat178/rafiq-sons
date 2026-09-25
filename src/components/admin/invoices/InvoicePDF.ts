"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generateInvoicePDF(elementId: string, filename: string): Promise<boolean> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Invoice element with id ${elementId} not found`);
      return false;
    }

    // Capture element with high pixel ratio for print sharpness
    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5x retina resolution for razor-sharp vector-like text
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    // Handle multi-page if content overflows 1 page
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }

    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
    return true;
  } catch (error) {
    console.error("Failed to generate invoice PDF:", error);
    return false;
  }
}
