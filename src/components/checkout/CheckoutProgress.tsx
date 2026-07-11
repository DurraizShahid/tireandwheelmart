"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { CHECKOUT_STEPS, CHECKOUT_STEP_LABELS, type CheckoutStep } from "@/lib/checkout-types";

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
  onStepClick: (step: CheckoutStep) => void;
}

export function CheckoutProgress({ currentStep, onStepClick }: CheckoutProgressProps) {
  const currentIndex = CHECKOUT_STEPS.indexOf(currentStep);

  return (
    <div className="mb-10">
      {/* Desktop: horizontal steps */}
      <div className="hidden sm:flex items-center justify-between">
        {CHECKOUT_STEPS.filter((s) => s !== "confirmation").map((s, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = s === currentStep;
          const stepNum = i + 1;

          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => isCompleted && onStepClick(s)}
                disabled={!isCompleted}
                className={cn(
                  "flex items-center gap-2.5 group",
                  isCompleted ? "cursor-pointer" : "cursor-default"
                )}
                aria-label={`Go to step ${stepNum}: ${CHECKOUT_STEP_LABELS[s]}`}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shrink-0",
                    isCompleted && "bg-green-600 text-white",
                    isCurrent && "bg-blue-600 text-white ring-4 ring-blue-100",
                    !isCompleted && !isCurrent && "bg-gray-100 text-gray-400"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium hidden lg:inline transition-colors",
                    isCompleted && "text-green-600",
                    isCurrent && "text-blue-600",
                    !isCompleted && !isCurrent && "text-gray-400"
                  )}
                >
                  {CHECKOUT_STEP_LABELS[s]}
                </span>
              </button>
              {i < CHECKOUT_STEPS.length - 2 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-3 transition-colors duration-300",
                    i < currentIndex ? "bg-green-600" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: compact progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">
            Step {currentIndex + 1} of {CHECKOUT_STEPS.length - 1}
          </span>
          <span className="text-sm text-muted-foreground">{CHECKOUT_STEP_LABELS[currentStep]}</span>
        </div>
        <div
          className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={CHECKOUT_STEPS.length - 1}
        >
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex) / (CHECKOUT_STEPS.length - 2)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
