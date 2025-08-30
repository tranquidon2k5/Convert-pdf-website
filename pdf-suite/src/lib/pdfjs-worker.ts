import { GlobalWorkerOptions } from "pdfjs-dist";

let configured = false;

export function ensurePdfjsWorker() {
  if (configured) return;
  try {
    const worker = new Worker(
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" }
    );
    (GlobalWorkerOptions as any).workerPort = worker as any;
    configured = true;
    return;
  } catch (e) {
    // Fallback to workerSrc served by app (requires copying worker to public/ if needed)
    try {
      (GlobalWorkerOptions as any).workerSrc = "/pdf.worker.min.mjs";
      configured = true;
    } catch {
      // ignore
    }
  }
}


