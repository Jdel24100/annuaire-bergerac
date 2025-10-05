import React from 'react';
import { cn } from './utils';

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("dropdown-menu-base", className)}
        {...props}
      />
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";