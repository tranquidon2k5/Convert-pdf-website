export type PdfBytes = Uint8Array | ArrayBuffer;

export interface ToolResult {
  files: { name: string; bytes: Uint8Array; mime: string }[];
  meta?: Record<string, unknown>;
}

export interface MergeParams {
  filenames?: string[];
}

export interface SplitParams {
  ranges: string; // e.g., "1-3,5"
}

export interface RotateParams {
  degrees: number; // 90, 180, 270
}

export interface OrganizeParams {
  pageOrder: number[]; // 0-based order
}

export interface WatermarkParams {
  text: string;
  opacity?: number; // 0..1
  fontSize?: number; // pts
}

export interface PageNumbersParams {
  position?: "bottom-right" | "bottom-center" | "bottom-left";
  startAt?: number;
}

export interface CompressParams {
  quality?: number; // 0..1
}

export interface ImageToPdfParams {
  pageSize?: { width: number; height: number }; // pts
}







