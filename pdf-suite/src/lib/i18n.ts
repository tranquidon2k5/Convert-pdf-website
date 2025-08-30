"use client";

import { useLanguage } from "@/app/providers";

type Messages = Record<string, string>;

const en: Messages = {
  "home.subtitle": "All-in-one PDF toolkit to merge, split, compress, convert and more.",
  "home.quick_tools": "Quick tools",
  "nav.tools": "Tools",
  "nav.features": "Features",
  "nav.pricing": "Pricing",
  "nav.help": "Help",
  "nav.blog": "Blog",
  "nav.dashboard": "Dashboard",

  "footer.product": "Product",
  "footer.company": "Company",
  "footer.features": "Features",
  "footer.pricing": "Pricing",
  "footer.business": "Business",
  "footer.api_connectors": "API Connectors",
  "footer.about": "About",
  "footer.contact": "Contact",
  "footer.help": "Help",
  "footer.blog": "Blog",

  "tool.parameters": "Parameters",
  "tool.drop_here": "Drop PDF files here",
  "tool.or_click": "or click to browse",
  "tool.run_local": "Run locally",
  "tool.queue_server": "Queue on server",
  "tool.save_workspace": "Save to Workspace",
};

const vi: Messages = {
  "home.subtitle": "Bộ công cụ PDF tất cả-trong-một: gộp, tách, nén, chuyển đổi và hơn thế nữa.",
  "home.quick_tools": "Công cụ nhanh",
  "nav.tools": "Công cụ",
  "nav.features": "Tính năng",
  "nav.pricing": "Bảng giá",
  "nav.help": "Trợ giúp",
  "nav.blog": "Blog",
  "nav.dashboard": "Bảng điều khiển",

  "footer.product": "Sản phẩm",
  "footer.company": "Công ty",
  "footer.features": "Tính năng",
  "footer.pricing": "Bảng giá",
  "footer.business": "Doanh nghiệp",
  "footer.api_connectors": "Kết nối API",
  "footer.about": "Giới thiệu",
  "footer.contact": "Liên hệ",
  "footer.help": "Trợ giúp",
  "footer.blog": "Blog",

  "tool.parameters": "Tham số",
  "tool.drop_here": "Thả tệp PDF vào đây",
  "tool.or_click": "hoặc bấm để chọn tệp",
  "tool.run_local": "Chạy cục bộ",
  "tool.queue_server": "Xếp hàng trên máy chủ",
  "tool.save_workspace": "Lưu vào Không gian làm việc",
};

const dictionaries = { en, vi } as const;

export function useI18n() {
  const { language } = useLanguage();
  const dict = dictionaries[language] as Messages;
  function t(key: string): string {
    return dict[key] ?? key;
  }
  return { t, language };
}


