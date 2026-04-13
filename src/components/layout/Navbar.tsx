"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { CurrencySelector } from "./CurrencySelector";
import { useCartStore } from "@/stores/cartStore";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface NavbarProps {
  notificationSlot?: ReactNode;
}

export function Navbar({ notificationSlot }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const t = useTranslations("nav");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      role="banner"
      className={`
        sticky top-0 z-50 h-16 border-b border-border-subtle
        bg-canvas transition-all duration-200
        ${scrolled ? "backdrop-blur-xl bg-canvas/80" : ""}
      `}
    >
      <div className="max-w-[1400px] mx-auto h-full px-4 sm:px-6 flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.png"
            alt="Mymiso"
            width={104}
            height={104}
            className="rounded-comfortable"
            priority
          />
        </Link>

        {/* Search — center, hidden on small mobile */}
        <SearchBar className="hidden sm:block flex-1 max-w-xl mx-auto" />

        {/* Right section */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile search icon */}
          <Link
            href="/search"
            className="sm:hidden p-2 text-text-secondary hover:text-text-primary"
            aria-label={t("search")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Link>

          {/* Language & Currency */}
          <LanguageSelector />
          <CurrencySelector />

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          {notificationSlot}

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label={t("cart")}
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span
                aria-live="polite"
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-mizo-red rounded-full font-tabular"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* User / Login */}
          <Link
            href="/login"
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label={t("account")}
          >
            <User size={22} />
          </Link>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 inset-x-0 bg-surface-overlay border-b border-border-default p-4 shadow-elevated">
          <SearchBar compact className="mb-4" />
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="px-3 py-2 text-[14px] font-medium text-text-secondary hover:text-text-primary rounded-comfortable hover:bg-surface-subtle transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              href="/products"
              className="px-3 py-2 text-[14px] font-medium text-text-secondary hover:text-text-primary rounded-comfortable hover:bg-surface-subtle transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("products")}
            </Link>
            <Link
              href="/seller/dashboard"
              className="px-3 py-2 text-[14px] font-medium text-text-secondary hover:text-text-primary rounded-comfortable hover:bg-surface-subtle transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("startSelling")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
