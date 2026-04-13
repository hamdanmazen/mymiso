"use client";

import { useTranslations } from "next-intl";

export default function StorefrontError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-error-subtle flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-[24px] font-bold text-text-primary mb-2">
          {t("serverError")}
        </h2>
        <p className="text-[14px] text-text-secondary mb-6">
          {t("serverErrorDescription")}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-semibold text-white bg-mizo-red rounded-comfortable hover:bg-mizo-red-hover active:scale-[0.98] transition-all"
        >
          {t("tryAgain")}
        </button>
      </div>
    </div>
  );
}
