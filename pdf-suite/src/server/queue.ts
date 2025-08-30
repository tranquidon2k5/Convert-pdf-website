import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

export const jobsQueue = new Queue("jobs", { connection });
export const jobsEvents = new QueueEvents("jobs", { connection });

export type PdfToWordPayload = {
  filePath: string; // local path to input PDF
  outputPath: string; // expected output .docx
};

export function startWorker(handlePdfToWord: (payload: PdfToWordPayload, job: Job) => Promise<any>) {
  const worker = new Worker(
    "jobs",
    async (job: Job) => {
      if (job.name === "pdf_to_word") {
        return await handlePdfToWord(job.data as PdfToWordPayload, job);
      }
    },
    { connection }
  );
  return worker;
}


