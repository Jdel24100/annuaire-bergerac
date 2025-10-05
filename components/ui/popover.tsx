import React from 'react';
import { cn } from './utils';

interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("popover-base", className)}
        {...props}
      />
    );
  }
);

Popover.displayName = "Popover";