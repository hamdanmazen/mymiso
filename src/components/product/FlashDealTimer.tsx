"use client";

import { useState, useEffect } from "react";

interface FlashDealTimerProps {
  endsAt: string;
  className?: string;
}

function getTimeRemaining(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function FlashDealTimer({ endsAt, className = "" }: FlashDealTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    setMounted(true);
    setTime(getTimeRemaining(endsAt));
    const interval = setInterval(() => {
      setTime(getTimeRemaining(endsAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (!mounted) {
    return (
      <span
        className={`
          inline-flex items-center gap-0.5
          bg-mizo-red text-white text-[11px] font-bold
          px-2.5 py-1 rounded-standard font-tabular
          ${className}
        `}
      >
        --:--:--
      </span>
    );
  }

  if (time.expired) {
    return (
      <span className={`text-[11px] font-bold text-text-muted ${className}`}>
        Ended
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center gap-0.5
        bg-mizo-red text-white text-[11px] font-bold
        px-2.5 py-1 rounded-standard font-tabular
        ${className}
      `}
    >
      {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}
    </span>
  );
}
