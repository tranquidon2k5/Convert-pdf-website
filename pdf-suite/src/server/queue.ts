import { Queue, Worker, QueueEvents, Job, type QueueOptions, type WorkerOptions } from "bullmq";
import IORedis, { type RedisOptions } from "ioredis";

function createConnection() {
  const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
  const opts: RedisOptions = { maxRetriesPerRequest: null } as RedisOptions;
  return new IORedis(url, opts);
}

function createQueueOptions(): QueueOptions {
  return { connection: createConnection() };
}

function createWorkerOptions(): WorkerOptions {
  return { connection: createConnection() } as WorkerOptions;
}

export function getJobsQueue() {
  return new Queue("jobs", createQueueOptions());
}

export function getJobsEvents() {
  return new QueueEvents("jobs", createQueueOptions());
}

export type PdfToWordPayload = {
  filePath: string; // local path to input PDF
  outputPath: string; // expected output .docx
};

export function startWorker(handlePdfToWord: (payload: PdfToWordPayload, job: Job) => Promise<unknown>) {
  const worker = new Worker(
    "jobs",
    async (job: Job) => {
      if (job.name === "pdf_to_word") {
        return await handlePdfToWord(job.data as PdfToWordPayload, job);
      }
    },
    createWorkerOptions()
  );
  return worker;
}


