"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  className?: string;
  compact?: boolean;
}

export function SearchBar({ className = "", compact = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        size={compact ? 16 : 20}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands, and more..."
        className={`
          w-full bg-surface-raised border-2 border-border-default
          rounded-large text-text-primary placeholder:text-text-muted
          transition-all duration-200
          focus:outline-none focus:border-mizo-teal
          ${compact ? "h-10 pl-10 pr-10 text-[13px]" : "h-[52px] pl-12 pr-14 text-[14px]"}
        `}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-14 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
        >
          <X size={16} />
        </button>
      )}
      <button
        type="submit"
        className={`
          absolute right-1.5 top-1/2 -translate-y-1/2
          bg-mizo-red hover:bg-mizo-red-hover
          text-white rounded-comfortable
          flex items-center justify-center transition-colors
          ${compact ? "h-7 w-7" : "h-10 w-10"}
        `}
        aria-label="Search"
      >
        <Search size={compact ? 14 : 18} />
      </button>
    </form>
  );
}
