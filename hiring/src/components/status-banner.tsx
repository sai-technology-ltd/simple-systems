import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBannerProps {
  tone?: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  className?: string;
}

const toneStyles = {
  info: "border-slate-200 bg-slate-50 text-slate-700",
  success: "border-slate-200 bg-[rgb(var(--success-soft))] text-slate-800",
  warning: "border-slate-200 bg-[rgb(var(--warning-soft))] text-slate-800",
  error: "border-red-200 bg-red-50 text-red-900",
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
    <div className={cn("animate-fade-in rounded-xl border p-4", toneStyles[tone], className)}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          {description ? <p className="mt-1 text-sm opacity-80">{description}</p> : null}
        </div>
      </div>
    </div>
  );
}
