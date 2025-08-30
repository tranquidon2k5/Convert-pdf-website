import { notFound } from "next/navigation";
import ToolUI from "@/components/ToolUI";

const allowedTools = new Set([
  "merge",
  "split",
  "rotate",
  "organize",
  "compress",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "pdf-to-word",
  "word-to-pdf",
  "watermark",
  "page-numbers",
  "protect",
  "unlock",
  "ocr",
  "repair",
]);

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  if (!allowedTools.has(tool)) {
    notFound();
  }
  return <ToolUI toolName={tool} />;
}


