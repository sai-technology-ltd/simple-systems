import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBannerProps {
  tone?: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  className?: string;
}

const toneStyles = {
  info: "border-slate-200 bg-white/80 text-slate-700",
  success: "border-emerald-200 bg-emerald-50/80 text-emerald-950",
  warning: "border-amber-200 bg-amber-50/90 text-amber-950",
  error: "border-red-200 bg-red-50/90 text-red-950",
} as const;

const toneIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: AlertCircle,
} as const;

export function StatusBanner({
  tone = "info",
  title,
  description,
  className,
}: StatusBannerProps) {
  const Icon = toneIcons[tone];

  return (
    <div className={cn("animate-fade-in rounded-2xl border p-4 shadow-sm shadow-slate-900/5", toneStyles[tone], className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/80 ring-1 ring-black/5">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          {description ? <p className="mt-1 text-sm opacity-80">{description}</p> : null}
        </div>
      </div>
    </div>
  );
}
