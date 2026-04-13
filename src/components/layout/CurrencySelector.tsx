"use client";

import { useState, useRef, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";

const currencies = [
  { code: "USD", label: "USD ($)", symbol: "$" },
  { code: "LBP", label: "LBP (ل.ل)", symbol: "ل.ل" },
] as const;

type CurrencyCode = (typeof currencies)[number]["code"];

function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "USD";
  return (localStorage.getItem("currency") as CurrencyCode) || "USD";
}

export function CurrencySelector() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const t = useTranslations("currency");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrency(getStoredCurrency());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  function switchCurrency(code: CurrencyCode) {
    setCurrency(code);
    localStorage.setItem("currency", code);
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent("currency-change", { detail: code }));
    setOpen(false);
  }

  const active = currencies.find((c) => c.code === currency) || currencies[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-2 text-text-secondary hover:text-text-primary transition-colors text-[13px]"
        aria-label={t("selector")}
      >
        <DollarSign size={18} />
        <span className="hidden sm:inline">{active.code}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-surface-overlay border border-border-default rounded-comfortable shadow-elevated z-50 overflow-hidden">
          {currencies.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => switchCurrency(c.code)}
              className={`
                w-full text-left px-3 py-2 text-[13px] transition-colors
                ${currency === c.code ? "text-mizo-teal bg-mizo-teal-subtle" : "text-text-secondary hover:bg-surface-subtle hover:text-text-primary"}
              `}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
