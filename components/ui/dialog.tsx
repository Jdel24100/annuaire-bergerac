import React from 'react';
import { cn } from './utils';

interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("dialog-base", className)}
        {...props}
      />
    );
  }
);

Dialog.displayName = "Dialog";