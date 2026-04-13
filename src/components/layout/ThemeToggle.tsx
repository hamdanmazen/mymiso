"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check what's actually active: stored preference or system
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setIsDark(stored === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", next);

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
  }

  return (
    <button
      onClick={toggle}
      className="p-2 text-text-secondary hover:text-text-primary transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
