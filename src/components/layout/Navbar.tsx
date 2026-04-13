"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Settings,
  Shield,
} from "lucide-react";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { CurrencySelector } from "./CurrencySelector";
import { useCartStore } from "@/stores/cartStore";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { ReactNode } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface NavbarProps {
  notificationSlot?: ReactNode;
}

export function Navbar({ notificationSlot }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const t = useTranslations("nav");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()
          .then(({ data: profile }) => setUserRole(profile?.role ?? null));
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setUserRole(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    setMenuOpen(false);
    router.push("/login");
  }

  const userName =
    user?.user_metadata?.full_name ??
    user?.email?.split("@")[0] ??
    "User";
  const userInitial = userName[0]?.toUpperCase() ?? "U";

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

          {/* User Menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-comfortable hover:bg-surface-subtle transition-colors"
              >
                <div className="w-8 h-8 rounded-circle bg-mizo-red-subtle text-mizo-red flex items-center justify-center text-[13px] font-semibold">
                  {userInitial}
                </div>
                <span className="hidden sm:block text-[14px] font-medium text-text-primary max-w-[100px] truncate">
                  {userName}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-56 bg-surface-overlay border border-border-default rounded-comfortable shadow-elevated py-1 z-50">
                  <div className="px-4 py-2.5 border-b border-border-subtle">
                    <p className="text-[14px] font-semibold text-text-primary truncate">{userName}</p>
                    <p className="text-[12px] text-text-muted truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-[14px] text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      My Account
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-[14px] text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                    >
                      <ShoppingBag size={16} />
                      My Orders
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-[14px] text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    {userRole === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-[14px] text-mizo-red hover:bg-mizo-red-subtle transition-colors"
                      >
                        <Shield size={16} />
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-border-subtle py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-[14px] text-error hover:bg-error-subtle transition-colors"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-2 text-[14px] font-medium text-white bg-mizo-red rounded-comfortable hover:bg-mizo-red-hover transition-colors"
            >
              <User size={16} />
              <span className="hidden sm:block">Log In</span>
            </Link>
          )}
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
