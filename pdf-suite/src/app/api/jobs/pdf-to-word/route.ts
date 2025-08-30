import { NextResponse } from "next/server";
import "@/server/init";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import { getJobsQueue } from "@/server/queue";
import crypto from "crypto";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ message: "Missing file" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const id = crypto.randomUUID();
  const dir = path.join(process.cwd(), ".data", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const inputPath = path.join(dir, id + ".pdf");
  await fs.writeFile(inputPath, buf);

  const outDir = path.join(process.cwd(), ".data", "results");
  await fs.mkdir(outDir, { recursive: true });
  const outputPath = path.join(outDir, id + ".docx");

  try {
    const job = await getJobsQueue().add(
      "pdf_to_word",
      { filePath: inputPath, outputPath },
      { removeOnComplete: true, attempts: 1 }
    );
    return NextResponse.json({ jobId: job.id, id });
  } catch (err) {
    // Fallback dev mode: run conversion inline without Redis
    try {
      await new Promise<void>((resolve, reject) => {
        const p = spawn("python", [path.join(process.cwd(), "scripts", "pdf_to_word.py"), inputPath, outputPath], { stdio: "inherit" });
        p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`pdf2docx exited ${code}`))));
        p.on("error", reject);
      });
      return NextResponse.json({ jobId: "inline", id });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Conversion failed. Install Python and pdf2docx.";
      return NextResponse.json(
        { message },
        { status: 500 }
      );
    }
  }
}


