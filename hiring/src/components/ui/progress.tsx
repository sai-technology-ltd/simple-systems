import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-zinc-100', className)} {...props}>
      <div
        className="h-full bg-[#ea5c1c] transition-all duration-500 ease-in-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
