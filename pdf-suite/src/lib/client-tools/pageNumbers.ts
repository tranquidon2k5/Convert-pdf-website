import { PDFDocument, StandardFonts } from "pdf-lib";
import type { ToolResult, PageNumbersParams, PdfBytes } from "./types";

export async function addPageNumbers(input: PdfBytes, params: PageNumbersParams = {}): Promise<ToolResult> {
  const src = await PDFDocument.load(input instanceof ArrayBuffer ? new Uint8Array(input) : input);
  const font = await src.embedFont(StandardFonts.Helvetica);
  const startAt = params.startAt ?? 1;
  const pos = params.position ?? "bottom-right";
  const pages = src.getPages();
  pages.forEach((page, idx) => {
    const label = String(startAt + idx);
    const { width } = page.getSize();
    const textWidth = font.widthOfTextAtSize(label, 10);
    let x = width - textWidth - 24;
    if (pos === "bottom-center") x = width / 2 - textWidth / 2;
    if (pos === "bottom-left") x = 24;
    page.drawText(label, { x, y: 18, size: 10, font });
  });
  const bytes = await src.save();
  return { files: [{ name: "page-numbers.pdf", bytes, mime: "application/pdf" }] };
}






