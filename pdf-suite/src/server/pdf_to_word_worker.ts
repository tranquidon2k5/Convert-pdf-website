import { startWorker, type PdfToWordPayload } from "./queue";
import { spawn } from "child_process";
import path from "path";
import { prisma } from "./prisma";
import fs from "fs";

let started = false;
if (!started) {
  started = true;
  startWorker(async ({ filePath, outputPath }: PdfToWordPayload) => {
    await new Promise<void>((resolve, reject) => {
      const script = path.join(process.cwd(), "scripts", "pdf_to_word.py");
      const p = spawn("python", [script, filePath, outputPath], { stdio: "inherit" });
      p.on("exit", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`pdf2docx exited with code ${code}`));
      });
      p.on("error", reject);
    });

    // Persist as File row for the current user (anonymous for now)
    const stat = await fs.promises.stat(outputPath);
    await prisma.file.create({
      data: {
        name: path.basename(outputPath),
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        s3Key: outputPath,
        sizeBytes: stat.size,
        userId: "anon",
      },
    });
  });
}


