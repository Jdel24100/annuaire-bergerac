import React from 'react';
import { cn } from './utils';

interface InputProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Input = React.forwardRef<HTMLDivElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("input-base", className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";