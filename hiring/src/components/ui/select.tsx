import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/20 focus-visible:border-slate-400',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';

export { Select };
