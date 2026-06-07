"use client";

import * as React from "react";
import { MobileMenu } from "./mobile-menu";

interface MobileMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MobileMenuContext = React.createContext<MobileMenuContextValue>({
  open: false,
  setOpen: () => {},
});

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <MobileMenuContext.Provider value={{ open, setOpen }}>
      {children}
      <MobileMenu open={open} onOpenChange={setOpen} />
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  return React.useContext(MobileMenuContext);
}
