"use client";

import React from "react";
import { useLanguage } from "@/app/providers";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <select
      aria-label="Language"
      className="text-sm px-2 py-1 rounded border bg-background"
      value={language}
      onChange={(e) => setLanguage(e.target.value as any)}
    >
      <option value="en">EN</option>
      <option value="vi">VI</option>
    </select>
  );
}

export default LanguageSwitcher;


