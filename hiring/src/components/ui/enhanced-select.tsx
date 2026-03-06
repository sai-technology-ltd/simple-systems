"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Search } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface EnhancedSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function EnhancedSelect({ value, onChange, options, placeholder = "Select...", className }: EnhancedSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter(opt => 
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition-[border-color,box-shadow,transform] duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/20 focus-visible:border-slate-400",
          "hover:border-slate-300"
        )}
      >
        <span className={cn("flex items-center gap-2", !selectedOption && "text-slate-400")}>
          {selectedOption?.icon}
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="animate-fade-in absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/5">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-slate-500">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-slate-50",
                    option.value === value && "bg-blue-50 text-blue-700"
                  )}
                >
                  {option.icon}
                  <span className="flex-1 text-left">{option.label}</span>
                  {option.value === value && <Check className="h-4 w-4" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
