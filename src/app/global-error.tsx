"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex items-center justify-center bg-[#0f1114] text-[#f5f5f5] font-sans">
        <div className="text-center px-6 max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[rgba(239,68,68,0.12)] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold mb-2">Something Went Wrong</h1>
          <p className="text-[14px] text-[#9ca3af] mb-6">
            We&apos;re working on fixing this. Please try again later.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 text-[15px] font-semibold text-white bg-[#c0392b] rounded-[8px] hover:bg-[#a93226] transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
