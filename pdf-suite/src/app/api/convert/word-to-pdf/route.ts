import { NextResponse } from "next/server";
import mammoth from "mammoth";

// Simple Word(docx)->PDF via HTML->print to PDF using headless Chromium (edge).
// To keep the project light, we return HTML here; integrating Puppeteer in Next 15 + Turbopack may require custom config.

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ message: "Missing file" }, { status: 400 });
  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
  // Return HTML as a stopgap; a headless print-to-PDF step can be added later.
  return NextResponse.json({ html });
}







