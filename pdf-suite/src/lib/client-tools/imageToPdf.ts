import { PDFDocument } from "pdf-lib";
import type { ToolResult, ImageToPdfParams } from "./types";

export async function imageToPdf(images: { bytes: Uint8Array; name?: string }[], params: ImageToPdfParams = {}): Promise<ToolResult> {
  const pdf = await PDFDocument.create();
  for (const img of images) {
    let embedded;
    // naive detection
    if (img.name?.toLowerCase().endsWith(".png")) embedded = await pdf.embedPng(img.bytes);
    else embedded = await pdf.embedJpg(img.bytes);
    const { width, height } = params.pageSize ?? { width: embedded.width, height: embedded.height };
    const page = pdf.addPage([width, height]);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
  }
  const bytes = await pdf.save();
  return { files: [{ name: "images.pdf", bytes, mime: "application/pdf" }] };
}






