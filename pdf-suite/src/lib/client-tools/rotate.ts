import { PDFDocument, degrees } from "pdf-lib";
import type { ToolResult, RotateParams, PdfBytes } from "./types";

export async function rotatePdf(input: PdfBytes, params: RotateParams): Promise<ToolResult> {
  const src = await PDFDocument.load(input instanceof ArrayBuffer ? new Uint8Array(input) : input);
  const deg = params.degrees % 360;
  const pages = src.getPages();
  for (const page of pages) page.setRotation(degrees((page.getRotation().angle + deg + 360) % 360));
  const bytes = await src.save();
  return { files: [{ name: "rotated.pdf", bytes, mime: "application/pdf" }] };
}






