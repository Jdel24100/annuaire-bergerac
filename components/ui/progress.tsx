import React from 'react';
import { cn } from './utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("progress-base", className)}
        {...props}
      />
    );
  }
);

Progress.displayName = "Progress";