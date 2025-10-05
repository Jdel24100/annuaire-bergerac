import React from 'react';
import { cn } from './utils';

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Button = React.forwardRef<HTMLDivElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("button-base", className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";