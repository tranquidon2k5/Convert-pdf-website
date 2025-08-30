import { PDFDocument } from "pdf-lib";
import type { ToolResult, OrganizeParams, PdfBytes } from "./types";

export async function organizePdf(input: PdfBytes, params: OrganizeParams): Promise<ToolResult> {
  const src = await PDFDocument.load(input instanceof ArrayBuffer ? new Uint8Array(input) : input);
  const out = await PDFDocument.create();
  const order = params.pageOrder.filter((i) => i >= 0 && i < src.getPageCount());
  const copied = await out.copyPages(src, order);
  copied.forEach((p) => out.addPage(p));
  const bytes = await out.save();
  return { files: [{ name: "organized.pdf", bytes, mime: "application/pdf" }] };
}






