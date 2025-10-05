import React from 'react';
import { cn } from './utils';

interface TextareaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Textarea = React.forwardRef<HTMLDivElement, TextareaProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("textarea-base", className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";