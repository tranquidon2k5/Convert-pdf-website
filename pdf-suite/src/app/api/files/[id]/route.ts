import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { createReadStream } from "fs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const file = await prisma.file.findUnique({ where: { id: params.id } });
  if (!file) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const stream = createReadStream(file.s3Key);
  return new Response(stream as any, { headers: { "Content-Type": file.mime, "Content-Disposition": `inline; filename=${file.name}` } });
}







