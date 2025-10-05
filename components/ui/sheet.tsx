import React from 'react';
import { cn } from './utils';

interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("sheet-base", className)}
        {...props}
      />
    );
  }
);

Sheet.displayName = "Sheet";