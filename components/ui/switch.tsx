import React from 'react';
import { cn } from './utils';

interface SwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("switch-base", className)}
        {...props}
      />
    );
  }
);

Switch.displayName = "Switch";