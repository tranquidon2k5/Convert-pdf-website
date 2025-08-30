import { PDFDocument } from "pdf-lib";
import type { ToolResult, MergeParams, PdfBytes } from "./types";

export async function mergePdfs(inputs: PdfBytes[], params?: MergeParams): Promise<ToolResult> {
  const out = await PDFDocument.create();
  for (const bytes of inputs) {
    const src = await PDFDocument.load(bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes);
    const copied = await out.copyPages(src, src.getPageIndices());
    copied.forEach((p) => out.addPage(p));
  }
  const merged = await out.save();
  return { files: [{ name: params?.filenames?.join("+") || "merged.pdf", bytes: merged, mime: "application/pdf" }] };
}







