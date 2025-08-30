"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const toolLinks = [
  { href: "/tools/merge", label: "Merge" },
  { href: "/tools/split", label: "Split" },
  { href: "/tools/rotate", label: "Rotate" },
  { href: "/tools/organize", label: "Organize" },
  { href: "/tools/compress", label: "Compress" },
  { href: "/tools/jpg-to-pdf", label: "JPG → PDF" },
  { href: "/tools/pdf-to-jpg", label: "PDF → JPG" },
  { href: "/tools/watermark", label: "Watermark" },
  { href: "/tools/page-numbers", label: "Page numbers" },
  { href: "/tools/protect", label: "Protect" },
  { href: "/tools/unlock", label: "Unlock" },
  { href: "/tools/ocr", label: "OCR" },
  { href: "/tools/repair", label: "Repair" },
];

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="py-12">
        <h1 className="text-3xl font-semibold mb-3">PDF Suite</h1>
        <p className="text-black/70 dark:text-white/70">{t("home.subtitle")}</p>
      </section>

      <section className="py-6">
        <h2 className="text-xl font-semibold mb-4">{t("home.quick_tools")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {toolLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border rounded-md p-4 hover:bg-black/[.04] dark:hover:bg-white/[.06]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
