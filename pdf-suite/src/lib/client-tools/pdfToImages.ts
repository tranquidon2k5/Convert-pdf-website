import { getDocument } from "pdfjs-dist";
import { ensurePdfjsWorker } from "@/lib/pdfjs-worker";
import type { ToolResult, PdfBytes } from "./types";

// Consumers should configure workerSrc if needed; pdfjs-dist v3+ auto bundles in Next 15 Turbopack.

export async function pdfToImages(input: PdfBytes): Promise<ToolResult> {
  ensurePdfjsWorker();
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const loadingTask = getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const files: { name: string; bytes: Uint8Array; mime: string }[] = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx as any, viewport, canvas }).promise;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) continue;
    const arrayBuffer = await blob.arrayBuffer();
    files.push({ name: `page-${pageNum}.jpg`, bytes: new Uint8Array(arrayBuffer), mime: "image/jpeg" });
  }
  return { files };
}


