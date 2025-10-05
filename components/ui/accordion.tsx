import React from 'react';
import { cn } from './utils';

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("accordion-base", className)}
        {...props}
      />
    );
  }
);

Accordion.displayName = "Accordion";