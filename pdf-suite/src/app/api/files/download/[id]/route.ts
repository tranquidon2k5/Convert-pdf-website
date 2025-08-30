import { NextResponse } from "next/server";
import path from "path";
import { createReadStream } from "fs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const outPath = path.join(process.cwd(), ".data", "results", id + ".docx");
  const stream = createReadStream(outPath);
  return new Response(stream as any, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${id}.docx"`,
    },
  });
}







