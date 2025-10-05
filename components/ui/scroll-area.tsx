import React from 'react';
import { cn } from './utils';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("scroll-area-base", className)}
        {...props}
      />
    );
  }
);

ScrollArea.displayName = "ScrollArea";