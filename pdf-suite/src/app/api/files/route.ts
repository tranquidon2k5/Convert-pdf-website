import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

// Dev storage: write to .data/files under project. In prod, replace with S3.
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, mime, bytes, sizeBytes, userId } = body as { name: string; mime: string; bytes: string; sizeBytes?: number; userId?: string };
  if (!name || !mime || !bytes) return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  const dir = path.join(process.cwd(), ".data", "files");
  await fs.mkdir(dir, { recursive: true });
  const id = crypto.randomUUID();
  const filePath = path.join(dir, id + path.extname(name || ""));
  const buf = Buffer.from(bytes, "base64");
  await fs.writeFile(filePath, buf);

  const file = await prisma.file.create({
    data: {
      id,
      userId: userId ?? "anon",
      name,
      mime,
      sizeBytes: sizeBytes ?? buf.byteLength,
      s3Key: filePath,
    },
  });

  return NextResponse.json({ id: file.id });
}







