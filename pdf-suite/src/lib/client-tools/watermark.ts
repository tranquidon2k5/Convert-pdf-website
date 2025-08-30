import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { ToolResult, WatermarkParams, PdfBytes } from "./types";

export async function watermarkText(input: PdfBytes, params: WatermarkParams): Promise<ToolResult> {
  const src = await PDFDocument.load(input instanceof ArrayBuffer ? new Uint8Array(input) : input);
  const font = await src.embedFont(StandardFonts.Helvetica);
  const opacity = params.opacity ?? 0.2;
  const size = params.fontSize ?? 48;
  const pages = src.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(params.text, size);
    page.drawText(params.text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity,
      rotate: { type: "degrees", angle: 30 },
    });
  }
  const bytes = await src.save();
  return { files: [{ name: "watermarked.pdf", bytes, mime: "application/pdf" }] };
}







