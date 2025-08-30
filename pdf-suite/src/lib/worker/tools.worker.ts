/// <reference lib="webworker" />

import { mergePdfs } from "@/lib/client-tools/merge";
import { splitPdf } from "@/lib/client-tools/split";
import { rotatePdf } from "@/lib/client-tools/rotate";
import { organizePdf } from "@/lib/client-tools/organize";
import { watermarkText } from "@/lib/client-tools/watermark";
import { addPageNumbers } from "@/lib/client-tools/pageNumbers";
import { compressBasic } from "@/lib/client-tools/compressBasic";
import { imageToPdf } from "@/lib/client-tools/imageToPdf";
import { pdfToImages } from "@/lib/client-tools/pdfToImages";

type WorkerRequest =
  | { tool: "merge"; files: Uint8Array[]; params?: any }
  | { tool: "split"; file: Uint8Array; params: any }
  | { tool: "rotate"; file: Uint8Array; params: any }
  | { tool: "organize"; file: Uint8Array; params: any }
  | { tool: "watermark"; file: Uint8Array; params: any }
  | { tool: "pageNumbers"; file: Uint8Array; params: any }
  | { tool: "compressBasic"; file: Uint8Array; params: any }
  | { tool: "imageToPdf"; images: { bytes: Uint8Array; name?: string }[]; params: any }
  | { tool: "pdfToImages"; file: Uint8Array };

self.onmessage = async (ev: MessageEvent<WorkerRequest>) => {
  try {
    const data = ev.data;
    switch (data.tool) {
      case "merge":
        self.postMessage(await mergePdfs(data.files, data.params));
        break;
      case "split":
        self.postMessage(await splitPdf(data.file, data.params));
        break;
      case "rotate":
        self.postMessage(await rotatePdf(data.file, data.params));
        break;
      case "organize":
        self.postMessage(await organizePdf(data.file, data.params));
        break;
      case "watermark":
        self.postMessage(await watermarkText(data.file, data.params));
        break;
      case "pageNumbers":
        self.postMessage(await addPageNumbers(data.file, data.params));
        break;
      case "compressBasic":
        self.postMessage(await compressBasic(data.file, data.params));
        break;
      case "imageToPdf":
        self.postMessage(await imageToPdf(data.images, data.params));
        break;
      case "pdfToImages":
        self.postMessage(await pdfToImages(data.file));
        break;
      default:
        throw new Error("Unknown tool");
    }
  } catch (err: any) {
    self.postMessage({ error: err?.message ?? String(err) });
  }
};

export {};






