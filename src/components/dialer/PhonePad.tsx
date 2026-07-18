"use client";

import { useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PhonePadProps {
  value: string;
  onChange: (value: string) => void;
  onCall: () => void;
  disabled?: boolean;
}

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

export function PhonePad({ value, onChange, onCall, disabled }: PhonePadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        onChange(value + e.key);
      } else if (e.key === "Backspace") {
        onChange(value.slice(0, -1));
      } else if (e.key === "Enter" && value.length >= 3) {
        onCall();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [value, onChange, onCall]);

  const handleKeyPress = useCallback((key: string) => {
    onChange(value + key);
  }, [value, onChange]);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter phone number"
        className="w-full text-center text-2xl font-mono tracking-widest bg-transparent border-0 outline-none focus:ring-0 placeholder:text-muted-foreground/40"
        disabled={disabled}
      />
      <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
        {KEYS.flat().map((key) => (
          <Button
            key={key}
            variant="outline"
            size="lg"
            disabled={disabled}
            className="h-16 w-full text-xl font-semibold rounded-xl hover:bg-accent active:scale-95 transition-all"
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </Button>
        ))}
      </div>
      <div className="flex gap-2 max-w-[260px] mx-auto">
        <Button
          variant="ghost"
          size="lg"
          className="flex-1 h-14 text-muted-foreground"
          disabled={disabled || value.length === 0}
          onClick={() => onChange(value.slice(0, -1))}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white text-base font-semibold"
          disabled={disabled || value.length < 3}
          onClick={onCall}
        >
          {disabled ? "Calling..." : "Call"}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="flex-1 h-14 text-muted-foreground"
          disabled={disabled || value.length === 0}
          onClick={() => onChange("")}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
