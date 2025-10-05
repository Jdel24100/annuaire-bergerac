import React from 'react';
import { cn } from './utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("avatar-base", className)}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";