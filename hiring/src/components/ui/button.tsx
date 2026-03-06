import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/30 active:scale-[0.99]',
  {
    variants: {
      variant: {
        default: 'bg-slate-700 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md',
        secondary: 'border border-slate-200 bg-slate-100 text-slate-700 hover:-translate-y-0.5 hover:bg-slate-200',
        ghost: 'text-slate-700 hover:bg-slate-100',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
