import React from 'react';
import { cn } from './utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("alert-base", className)}
        {...props}
      />
    );
  }
);

Alert.displayName = "Alert";