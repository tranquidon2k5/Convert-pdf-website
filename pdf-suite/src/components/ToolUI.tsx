"use client";

import React, { useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { runToolInWorker } from "@/lib/worker/runTool";
import { saveResultFile } from "@/lib/saveResult";

type SelectedFile = {
  file: File;
  url: string;
};

export function ToolUI({ toolName }: { toolName: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [params, setParams] = useState<Record<string, string | number | boolean>>({});
  const { t } = useI18n();

  function onDropFiles(files: FileList | null) {
    if (!files) return;
    const list: SelectedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files.item(i);
      if (!f) continue;
      if (toolName === "jpg-to-pdf") {
        if (!f.type.startsWith("image/")) continue;
      } else {
        if (!f.type.includes("pdf")) continue;
      }
      list.push({ file: f, url: URL.createObjectURL(f) });
    }
    setSelectedFiles((prev) => [...prev, ...list]);
  }

  function handleBrowse() {
    inputRef.current?.click();
  }

  const hasFiles = selectedFiles.length > 0;
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{ name: string; bytes: Uint8Array; mime: string }[]>([]);

  const acceptMime = useMemo(() => (toolName === "jpg-to-pdf" ? "image/*" : toolName === "word-to-pdf" ? ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "application/pdf"), [toolName]);

  async function runLocal() {
    if (!hasFiles) return;
    setRunning(true);
    setResults([]);
    try {
      if (toolName === "merge") {
        const files = await Promise.all(selectedFiles.map(async (sf) => new Uint8Array(await sf.file.arrayBuffer())));
        const res = await runToolInWorker({ tool: "merge", files, params: { filenames: selectedFiles.map((f) => f.file.name) } });
        setResults(res.files);
      } else if (toolName === "split") {
        const file = new Uint8Array(await selectedFiles[0].file.arrayBuffer());
        const res = await runToolInWorker({ tool: "split", file, params: { ranges: String(params.pages || "1") } });
        setResults(res.files);
      } else if (toolName === "rotate") {
        const file = new Uint8Array(await selectedFiles[0].file.arrayBuffer());
        const res = await runToolInWorker({ tool: "rotate", file, params: { degrees: Number(params.degrees || 90) } });
        setResults(res.files);
      } else if (toolName === "organize") {
        const file = new Uint8Array(await selectedFiles[0].file.arrayBuffer());
        const order = String(params.order || "").split(",").map((n) => parseInt(String(n).trim(), 10) - 1).filter((n) => Number.isFinite(n));
        const res = await runToolInWorker({ tool: "organize", file, params: { pageOrder: order } });
        setResults(res.files);
      } else if (toolName === "watermark") {
        const file = new Uint8Array(await selectedFiles[0].file.arrayBuffer());
        const res = await runToolInWorker({ tool: "watermark", file, params: { text: String(params.text || "CONFIDENTIAL"), opacity: Number(params.opacity || 0.2), fontSize: Number(params.fontSize || 48) } });
        setResults(res.files);
      } else if (toolName === "page-numbers") {
        const file = new Uint8Array(await selectedFiles[0].file.arrayBuffer());
        const res = await runToolInWorker({ tool: "pageNumbers", file, params: { position: String(params.pos || "bottom-right"), startAt: Number(params.start || 1) } });
        setResults(res.files);
      } else if (toolName === "compress") {
        const file = new Uint8Array(await selectedFiles[0].file.arrayBuffer());
        const res = await runToolInWorker({ tool: "compressBasic", file, params: { quality: Number(params.quality || 0.8) } });
        setResults(res.files);
      } else if (toolName === "jpg-to-pdf") {
        const images = await Promise.all(selectedFiles.map(async (sf) => ({ bytes: new Uint8Array(await sf.file.arrayBuffer()), name: sf.file.name })));
        const res = await runToolInWorker({ tool: "imageToPdf", images, params: {} });
        setResults(res.files);
      } else if (toolName === "pdf-to-jpg") {
        const file = new Uint8Array(await selectedFiles[0].file.arrayBuffer());
        const res = await runToolInWorker({ tool: "pdfToImages", file });
        setResults(res.files);
      } else if (toolName === "pdf-to-word") {
        const file = new Uint8Array(await selectedFiles[0].file.arrayBuffer());
        // lazy import to keep initial bundle small
        const mod = await import("@/lib/client-tools/pdfToWord");
        const res = await mod.pdfToWord(file);
        setResults(res.files);
      } else if (toolName === "word-to-pdf") {
        const form = new FormData();
        form.append("file", selectedFiles[0].file);
        const r = await fetch("/api/convert/word-to-pdf", { method: "POST", body: form });
        if (!r.ok) throw new Error("convert failed");
        const data = await r.json();
        const blob = new Blob([data.html], { type: "text/html" });
        setResults([{ name: "document.html", bytes: new Uint8Array(await blob.arrayBuffer()), mime: "text/html" }]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process file(s)");
    } finally {
      setRunning(false);
    }
  }

  async function saveAll() {
    for (const f of results) await saveResultFile(f);
    alert("Saved to workspace");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold capitalize">{toolName}</h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm rounded border hover:bg-black/[.04] dark:hover:bg-white/[.06]" onClick={runLocal} disabled={!hasFiles || running}>{running ? "Running..." : t("tool.run_local")}</button>
          <button
            className="px-3 py-1.5 text-sm rounded border hover:bg-black/[.04] dark:hover:bg-white/[.06]"
            disabled={!hasFiles || running}
            onClick={async () => {
              if (toolName !== "pdf-to-word") return alert("Queue supported for PDF→Word only (demo)");
              setRunning(true);
              try {
                const form = new FormData();
                form.append("file", selectedFiles[0].file);
                const res = await fetch("/api/jobs/pdf-to-word", { method: "POST", body: form });
                if (!res.ok) {
                  const msg = await res.json().catch(() => ({ message: "enqueue failed" }));
                  throw new Error(msg.message || "enqueue failed");
                }
                const { id: jobKey } = await res.json();
                // Poll until file exists
                let done = false; let attempts = 0;
                while (!done && attempts < 60) {
                  const r = await fetch(`/api/jobs/${encodeURIComponent(jobKey)}`, { headers: { "Accept": "application/json" } });
                  const j = await r.json();
                  done = j.done; attempts++;
                  if (!done) await new Promise((r) => setTimeout(r, 1000));
                }
                if (!done) throw new Error("Timed out");
                // Download link
                const a = document.createElement("a");
                a.href = `/api/files/download/${encodeURIComponent(jobKey)}`;
                a.download = "document.docx";
                a.click();
              } catch (e) {
                console.error(e);
                alert("Server queue failed");
              } finally {
                setRunning(false);
              }
            }}
          >
            {t("tool.queue_server")}
          </button>
          <button className="px-3 py-1.5 text-sm rounded border hover:bg-black/[.04] dark:hover:bg-white/[.06]" onClick={saveAll} disabled={results.length === 0}>{t("tool.save_workspace")}</button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="text-sm font-medium">{t("tool.parameters")}</div>
        <div className="flex flex-wrap gap-2">
          {/* Placeholder parameter controls */}
          <input
            className="border rounded px-2 py-1 text-sm"
            placeholder="Example: quality=75"
            onChange={(e) => setParams((p) => ({ ...p, quality: e.target.value }))}
          />
          <input
            className="border rounded px-2 py-1 text-sm"
            placeholder="Example: pages=1-3"
            onChange={(e) => setParams((p) => ({ ...p, pages: e.target.value }))}
          />
        </div>
      </div>

      <div
        className="border-2 border-dashed rounded-md py-12 grid place-items-center cursor-pointer hover:bg-black/[.02] dark:hover:bg-white/[.03]"
        onClick={handleBrowse}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onDropFiles(e.dataTransfer.files);
        }}
      >
        <div className="text-center">
          <div className="font-medium">{t("tool.drop_here")}</div>
          <div className="text-sm text-black/60 dark:text-white/60">{t("tool.or_click")}</div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={acceptMime}
          multiple
          className="hidden"
          onChange={(e) => onDropFiles(e.target.files)}
        />
      </div>

      {hasFiles && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedFiles.map((sf, idx) => (
            <div key={idx} className="border rounded-md overflow-hidden">
              <div className="px-3 py-2 text-sm border-b">{sf.file.name}</div>
              {toolName === "jpg-to-pdf" ? (
                // image preview
                <img src={sf.url} className="w-full h-[500px] object-contain" />
              ) : (
                <object data={sf.url} type="application/pdf" className="w-full h-[500px]" />
              )}
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Results</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((r, i) => {
              const blob = new Blob([r.bytes], { type: r.mime });
              const url = URL.createObjectURL(blob);
              return (
                <div key={i} className="border rounded p-3 text-sm flex items-center justify-between">
                  <div>{r.name}</div>
                  <a download={r.name} href={url} className="px-3 py-1 border rounded">Download</a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolUI;


