import React from 'react';
import { cn } from './utils';

interface CheckboxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("checkbox-base", className)}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";