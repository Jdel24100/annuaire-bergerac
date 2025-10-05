import React from 'react';
import { cn } from './utils';

interface LabelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Label = React.forwardRef<HTMLDivElement, LabelProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("label-base", className)}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";