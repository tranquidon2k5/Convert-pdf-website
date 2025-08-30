import { PDFDocument } from "pdf-lib";
import type { ToolResult, CompressParams, PdfBytes } from "./types";

// Basic compression: remove metadata and set useObjectStreams.
export async function compressBasic(input: PdfBytes, _params: CompressParams = {}): Promise<ToolResult> {
  const src = await PDFDocument.load(input instanceof ArrayBuffer ? new Uint8Array(input) : input, {
    ignoreEncryption: true,
  });
  // Remove metadata
  src.setTitle("");
  src.setAuthor("");
  const bytes = await src.save({ useObjectStreams: true, addDefaultPage: false });
  return { files: [{ name: "compressed.pdf", bytes, mime: "application/pdf" }] };
}







