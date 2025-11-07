import React, { useState, useRef, useEffect } from "react";

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const DropdownMenuTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return <>{children}</>;
};

const DropdownMenuContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 ${className}`}>
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const DropdownMenuSeparator = () => {
  return <div className="h-px bg-border" />;
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator };
