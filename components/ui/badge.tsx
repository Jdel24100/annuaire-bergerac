import React from 'react';
import { cn } from './utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("badge-base", className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";