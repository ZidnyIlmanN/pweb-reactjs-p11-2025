import React, { createContext, useContext, useState } from "react";

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return context;
};

const Sheet = ({ children, open: externalOpen, onOpenChange }: { children: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

const SheetTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = useSheet();
  return <div onClick={() => setOpen(true)}>{children}</div>;
};

const SheetContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { open, setOpen } = useSheet();
  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 h-full w-3/4 overflow-y-auto bg-background p-6 shadow-lg transition-transform transition-opacity duration-300 ease-in-out ${className} ${open ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"}`}
    >
      {children}
    </div>
  );
};

const SheetHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { setOpen } = useSheet();
  return (
    <div className={`mb-6 flex items-center justify-between ${className || ""}`}>
      {children}
      <SheetClose>
        <button
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </SheetClose>
    </div>
  );
};

const SheetTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={`text-lg font-semibold ${className || ""}`}>{children}</h2>;
};

const SheetFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`mt-6 ${className || ""}`}>{children}</div>;
};

const SheetClose = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = useSheet();
  return <div onClick={() => setOpen(false)}>{children}</div>;
};

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose };
