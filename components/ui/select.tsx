import React from 'react';
import { cn } from './utils';

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("select-base", className)}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";