import React from "react";

const Separator = ({ className }: { className?: string }) => {
  return <div className={`h-px bg-border ${className}`} />;
};

export { Separator };
