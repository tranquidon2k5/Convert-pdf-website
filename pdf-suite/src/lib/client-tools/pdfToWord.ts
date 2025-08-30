import { Document, Packer, Paragraph } from "docx";
import { getDocument } from "pdfjs-dist";
import { ensurePdfjsWorker } from "@/lib/pdfjs-worker";
import type { ToolResult, PdfBytes } from "./types";

export async function pdfToWord(input: PdfBytes): Promise<ToolResult> {
  ensurePdfjsWorker();
  const data = input instanceof ArrayBuffer ? new Uint8Array(input) : (input as Uint8Array);
  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;

  const children: Paragraph[] = [] as any;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    // Group items into lines (by y with tolerance)
    type Item = { str: string; x: number; y: number };
    const items: Item[] = (textContent.items as any[]).map((i) => ({
      str: i.str as string,
      x: (i.transform?.[4] as number) ?? 0,
      y: (i.transform?.[5] as number) ?? 0,
    }));
    const tolerance = 2;
    const lines = new Map<number, Item[]>();
    for (const it of items) {
      let key = it.y;
      for (const k of lines.keys()) {
        if (Math.abs(k - it.y) <= tolerance) {
          key = k;
          break;
        }
      }
      const arr = lines.get(key) ?? [];
      arr.push(it);
      lines.set(key, arr);
    }
    const orderedY = Array.from(lines.keys()).sort((a, b) => b - a);
    for (const y of orderedY) {
      const line = lines.get(y)!;
      line.sort((a, b) => a.x - b.x);
      const text = line.map((i) => i.str).join("");
      if (text.trim().length > 0) {
        children.push(new Paragraph(text));
      }
    }
    children.push(new Paragraph("")); // page spacer
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const buffer = await blob.arrayBuffer();
  return { files: [{ name: "document.docx", bytes: new Uint8Array(buffer), mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }] };
}


