import { NextRequest } from "next/server";
import path from "path";
import { createReadStream } from "fs";
import { Readable } from "stream";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const outPath = path.join(process.cwd(), ".data", "results", id + ".docx");
  const stream = createReadStream(outPath);
  const webStream = Readable.toWeb(stream) as unknown as ReadableStream;
  return new Response(webStream, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${id}.docx"`,
    },
  });
}







