"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}

const MobileHeader = ({ title, leftAction, rightAction, className }: MobileHeaderProps) => {
  return (
    <header className={cn("w-full max-w-md flex items-center justify-between py-4", className)}>
      <div className="w-8 flex justify-start">
        {leftAction}
      </div>
      <h1 className="text-2xl font-bold text-foreground truncate max-w-[calc(100%-8rem)] text-center">
        {title}
      </h1>
      <div className="w-8 flex justify-end">
        {rightAction}
      </div>
    </header>
  );
};

export default MobileHeader;