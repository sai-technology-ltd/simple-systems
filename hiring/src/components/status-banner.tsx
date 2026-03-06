import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBannerProps {
  tone?: "info" | "success" | "warning" | "error";
  title: string;
  description?: string;
  className?: string;
}

const toneStyles = {
  info: "border-zinc-200 bg-zinc-50 text-zinc-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
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
