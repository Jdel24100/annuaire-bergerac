import React from 'react';
import { cn } from './utils';

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("tooltip-base", className)}
        {...props}
      />
    );
  }
);

Tooltip.displayName = "Tooltip";