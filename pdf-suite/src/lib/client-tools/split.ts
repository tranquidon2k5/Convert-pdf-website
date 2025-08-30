import { PDFDocument } from "pdf-lib";
import type { ToolResult, SplitParams, PdfBytes } from "./types";

function parseRanges(input: string, pageCount: number): number[] {
  const set = new Set<number>();
  for (const part of input.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.includes("-")) {
      const [a, b] = trimmed.split("-").map((n) => parseInt(n, 10));
      const start = Math.max(1, Math.min(a, b));
      const end = Math.min(pageCount, Math.max(a, b));
      for (let i = start; i <= end; i++) set.add(i - 1);
    } else {
      const p = parseInt(trimmed, 10);
      if (!Number.isNaN(p) && p >= 1 && p <= pageCount) set.add(p - 1);
    }
  }
  return Array.from(set).sort((x, y) => x - y);
}

export async function splitPdf(input: PdfBytes, params: SplitParams): Promise<ToolResult> {
  const src = await PDFDocument.load(input instanceof ArrayBuffer ? new Uint8Array(input) : input);
  const pages = parseRanges(params.ranges, src.getPageCount());
  const outFiles: { name: string; bytes: Uint8Array; mime: string }[] = [];
  for (const pageIndex of pages) {
    const out = await PDFDocument.create();
    const [copied] = await out.copyPages(src, [pageIndex]);
    out.addPage(copied);
    const bytes = await out.save();
    outFiles.push({ name: `page-${pageIndex + 1}.pdf`, bytes, mime: "application/pdf" });
  }
  return { files: outFiles };
}







