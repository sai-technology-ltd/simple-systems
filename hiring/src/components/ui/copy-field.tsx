"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

interface CopyFieldProps {
  value: string;
  label?: string;
  showReveal?: boolean;
  className?: string;
}

export function CopyField({ value, label, showReveal = false, className }: CopyFieldProps) {
  const [copied, setCopied] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);

  const displayValue = showReveal && !revealed ? "••••••••••••••••" : value;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="text-sm font-medium text-zinc-700">{label}</label>}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type={showReveal && !revealed ? "password" : "text"}
            value={displayValue}
            readOnly
            className={cn(
              "h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 pr-20 text-sm font-mono text-zinc-900 transition-[border-color,box-shadow] duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea5c1c]/30",
              showReveal && "tracking-widest"
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {showReveal && (
              <button
                type="button"
                onClick={() => setRevealed(!revealed)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
              >
                {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                copied
                  ? "bg-emerald-100 text-emerald-600"
                  : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
