"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

const toolLinks = [
  { href: "/tools/merge", label: "Merge" },
  { href: "/tools/split", label: "Split" },
  { href: "/tools/rotate", label: "Rotate" },
  { href: "/tools/organize", label: "Organize" },
  { href: "/tools/compress", label: "Compress" },
  { href: "/tools/jpg-to-pdf", label: "JPG → PDF" },
  { href: "/tools/pdf-to-jpg", label: "PDF → JPG" },
  { href: "/tools/pdf-to-word", label: "PDF → Word" },
  { href: "/tools/word-to-pdf", label: "Word → PDF" },
  { href: "/tools/watermark", label: "Watermark" },
  { href: "/tools/page-numbers", label: "Page numbers" },
  { href: "/tools/protect", label: "Protect" },
  { href: "/tools/unlock", label: "Unlock" },
  { href: "/tools/ocr", label: "OCR" },
  { href: "/tools/repair", label: "Repair" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="w-full border-b border-black/[.08] dark:border-white/[.145] sticky top-0 z-40 bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold text-lg">PDF Suite</Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <div className="relative">
              <button
                className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-black/[.04] dark:hover:bg-white/[.06]"
                onClick={() => setOpen((v) => !v)}
              >
                {t("nav.tools")} <ChevronDown size={16} />
              </button>
              {open && (
                <div className="absolute mt-2 w-56 rounded-md shadow-lg border bg-background p-2">
                  {toolLinks.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block px-2 py-1.5 rounded hover:bg-black/[.04] dark:hover:bg-white/[.06]"
                      onClick={() => setOpen(false)}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/features">{t("nav.features")}</Link>
            <Link href="/pricing">{t("nav.pricing")}</Link>
            <Link href="/help">{t("nav.help")}</Link>
            <Link href="/blog">{t("nav.blog")}</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/dashboard" className="text-sm px-3 py-1.5 rounded border hover:bg-black/[.04] dark:hover:bg-white/[.06]">{t("nav.dashboard")}</Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;


