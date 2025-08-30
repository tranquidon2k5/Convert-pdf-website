import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const outPath = path.join(process.cwd(), ".data", "results", id + ".docx");
  try {
    const stat = await fs.stat(outPath).catch(() => null);
    if (stat) return NextResponse.json({ done: true, path: `/api/files/download/${id}` });
    // Inline mode: treat id="inline" as done when file exists with unknown id
    if (id === "inline") {
      // find latest .docx
      const dir = path.join(process.cwd(), ".data", "results");
      const files = await fs.readdir(dir).catch(() => [] as string[]);
      const docx = files.filter((f) => f.endsWith(".docx")).sort().pop();
      if (docx) {
        const inlineId = docx.replace(/\.docx$/, "");
        return NextResponse.json({ done: true, path: `/api/files/download/${inlineId}` });
      }
    }
    return NextResponse.json({ done: false });
  } catch {
    return NextResponse.json({ done: false });
  }
}


