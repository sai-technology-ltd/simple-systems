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
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Step {currentStep} of {steps.length}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-slate-200/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-slate-900 via-slate-700 to-orange-500 transition-all duration-500"
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
                "rounded-2xl border px-4 py-4 text-sm transition-all shadow-sm",
                active
                  ? "border-slate-300 bg-white shadow-md shadow-slate-900/5"
                  : complete
                    ? "border-emerald-200 bg-emerald-50/70"
                    : "border-slate-200 bg-white/70",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold shadow-sm",
                    complete
                      ? "bg-emerald-600 text-white"
                      : active
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500",
                  )}
                >
                  {complete ? <Check className="h-3.5 w-3.5" /> : step.number}
                </div>
                <span className={cn("font-medium", active ? "text-slate-900" : "text-slate-600")}>
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
