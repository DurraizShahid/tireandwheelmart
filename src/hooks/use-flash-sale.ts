"use client";

import { useState, useEffect, useCallback } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  expired: boolean;
}

function computeTimeLeft(endDate: string): TimeLeft {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    total: diff,
    expired: false,
  };
}

export function useFlashSale(endDate: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => computeTimeLeft(endDate));

  useEffect(() => {
    setTimeLeft(computeTimeLeft(endDate));
    const timer = setInterval(() => {
      const next = computeTimeLeft(endDate);
      setTimeLeft(next);
      if (next.expired) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return timeLeft;
}
