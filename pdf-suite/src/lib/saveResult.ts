export async function saveResultFile(file: { name: string; bytes: Uint8Array; mime: string }, userId?: string) {
  const res = await fetch("/api/files", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      mime: file.mime,
      sizeBytes: file.bytes.byteLength,
      bytes: Buffer.from(file.bytes).toString("base64"),
      userId,
    }),
  });
  if (!res.ok) throw new Error("Failed to save file");
  return (await res.json()) as { id: string };
}







