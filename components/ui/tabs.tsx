import React from 'react';
import { cn } from './utils';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("tabs-base", className)}
        {...props}
      />
    );
  }
);

Tabs.displayName = "Tabs";