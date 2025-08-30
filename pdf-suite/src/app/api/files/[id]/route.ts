import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { createReadStream } from "fs";
import { Readable } from "stream";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const stream = createReadStream(file.s3Key);
  const webStream = Readable.toWeb(stream) as unknown as ReadableStream;
  return new Response(webStream, { headers: { "Content-Type": file.mime, "Content-Disposition": `inline; filename=${file.name}` } });
}







