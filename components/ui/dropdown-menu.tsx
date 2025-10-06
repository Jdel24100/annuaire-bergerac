import React from 'react';
import { cn } from './utils';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuContentProps {
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
}

interface DropdownMenuItemProps {
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isOpen, setIsOpen } as any);
        }
        return child;
      })}
    </div>
  );
}

export function DropdownMenuTrigger({ asChild, children, ...props }: DropdownMenuTriggerProps & any) {
  return (
    <div onClick={() => props.setIsOpen?.(!props.isOpen)}>
      {children}
    </div>
  );
}

export function DropdownMenuContent({ align = 'end', children, ...props }: DropdownMenuContentProps & any) {
  if (!props.isOpen) return null;

  return (
    <div className={cn(
      "absolute top-full mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50",
      align === 'end' && "right-0",
      align === 'start' && "left-0",
      align === 'center' && "left-1/2 -translate-x-1/2"
    )}>
      {children}
    </div>
  );
}

export function DropdownMenuItem({ disabled, onClick, children }: DropdownMenuItemProps) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        disabled ? "pointer-events-none opacity-50" : "focus:bg-accent focus:text-accent-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-border" />;
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
      {children}
    </div>
  );
}