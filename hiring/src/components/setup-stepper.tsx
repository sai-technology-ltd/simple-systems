"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepItem {
  id: string;
  number: number;
  title: string;
}

interface SetupStepperProps {
  steps: readonly StepItem[];
  currentStep: number;
}

export function SetupStepper({ steps, currentStep }: SetupStepperProps) {
  const progress = ((currentStep - 1) / Math.max(steps.length - 1, 1)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>
          Step {currentStep} of {steps.length}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step) => {
          const complete = step.number < currentStep;
          const active = step.number === currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "rounded-xl border px-3 py-3 text-sm transition-colors",
                active
                  ? "border-orange-200 bg-orange-50"
                  : "border-zinc-100 bg-white",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    complete
                      ? "bg-emerald-100 text-emerald-700"
                      : active
                        ? "bg-orange-500 text-white"
                        : "bg-zinc-100 text-zinc-500",
                  )}
                >
                  {complete ? <Check className="h-3.5 w-3.5" /> : step.number}
                </div>
                <span className={cn("font-medium", active ? "text-zinc-900" : "text-zinc-600")}>
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
