"use client";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-black/[.08] dark:border-white/[.145] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold mb-2">PDF Suite</div>
          <p className="text-black/60 dark:text-white/60">All-in-one PDF toolkit.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">{t("footer.product")}</div>
          <ul className="space-y-1">
            <li><Link href="/features" className="hover:underline">{t("footer.features")}</Link></li>
            <li><Link href="/pricing" className="hover:underline">{t("footer.pricing")}</Link></li>
            <li><Link href="/business" className="hover:underline">{t("footer.business")}</Link></li>
            <li><Link href="/api-connectors" className="hover:underline">{t("footer.api_connectors")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">{t("footer.company")}</div>
          <ul className="space-y-1">
            <li><Link href="/about" className="hover:underline">{t("footer.about")}</Link></li>
            <li><Link href="/contact" className="hover:underline">{t("footer.contact")}</Link></li>
            <li><Link href="/help" className="hover:underline">{t("footer.help")}</Link></li>
            <li><Link href="/blog" className="hover:underline">{t("footer.blog")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-xs text-center py-4 text-black/60 dark:text-white/60">© {new Date().getFullYear()} PDF Suite</div>
    </footer>
  );
}

export default Footer;


