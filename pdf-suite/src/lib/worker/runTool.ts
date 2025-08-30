export type RunToolRequest = Parameters<Worker["postMessage"]>[0];

export async function runToolInWorker<T = any>(req: any): Promise<T> {
  const worker = new Worker(new URL("./tools.worker.ts", import.meta.url), { type: "module" });
  return new Promise<T>((resolve, reject) => {
    worker.onmessage = (e) => {
      const data = e.data;
      worker.terminate();
      if (data?.error) reject(new Error(data.error));
      else resolve(data as T);
    };
    worker.onerror = (e) => {
      worker.terminate();
      reject(e.error || new Error("Worker error"));
    };
    worker.postMessage(req);
  });
}







