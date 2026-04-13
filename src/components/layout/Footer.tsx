"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-surface-raised border-t border-border-subtle mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo.png" alt="Mymiso" width={128} height={128} className="rounded-comfortable" />
            </Link>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Multi-vendor marketplace. Sell fast, shop better. Discover products from trusted sellers.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">{tNav("products")}</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/products" className="text-[13px] text-text-secondary hover:text-mizo-teal transition-colors">{tNav("products")}</Link>
              <Link href="/categories/electronics" className="text-[13px] text-text-secondary hover:text-mizo-teal transition-colors">Electronics</Link>
              <Link href="/categories/fashion" className="text-[13px] text-text-secondary hover:text-mizo-teal transition-colors">Fashion</Link>
              <Link href="/categories/home-garden" className="text-[13px] text-text-secondary hover:text-mizo-teal transition-colors">Home & Garden</Link>
            </nav>
          </div>

          {/* Sell */}
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">{t("sellWithUs")}</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/seller/dashboard" className="text-[13px] text-text-secondary hover:text-mizo-teal transition-colors">{tNav("startSelling")}</Link>
              <Link href="/signup" className="text-[13px] text-text-secondary hover:text-mizo-teal transition-colors">{t("about")}</Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[14px] font-semibold text-text-primary mb-3">{t("help")}</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/orders" className="text-[13px] text-text-secondary hover:text-mizo-teal transition-colors">{t("contact")}</Link>
              <Link href="/messages" className="text-[13px] text-text-secondary hover:text-mizo-teal transition-colors">{t("buyerProtection")}</Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-text-muted">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-text-muted">
              Payments: Whish Pay &middot; Visa &middot; COD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
