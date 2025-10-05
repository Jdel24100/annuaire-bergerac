import React from 'react';
import { cn } from './utils';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("separator-base", className)}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";