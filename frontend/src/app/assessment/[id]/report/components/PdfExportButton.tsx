"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface PdfExportButtonProps {
  t: (key: string, params?: Record<string, string | number>) => string;
  containerId: string;
}

export default function PdfExportButton({
  t,
  containerId,
}: PdfExportButtonProps) {
  const [generating, setGenerating] = useState(false);

  async function handleExport() {
    setGenerating(true);
    try {
      const element = document.getElementById(containerId);
      if (!element) return;

      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#020617", // slate-950
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save("BasisPilot-Assessment-Report.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={generating}
      className="bg-brand-500 hover:bg-brand-400 disabled:opacity-60 text-white rounded-full px-6 py-3 font-medium transition-colors inline-flex items-center justify-center gap-2"
    >
      {generating ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          PDF...
        </>
      ) : (
        <>
          <Download size={16} />
          {t("assessment.report.download_pdf")}
        </>
      )}
    </button>
  );
}
