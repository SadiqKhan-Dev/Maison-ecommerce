"use client";

import * as React from "react";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const [isPending, setIsPending] = React.useState(false);

  const onSignOut = async () => {
    setIsPending(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={isPending}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm text-muted hover:bg-error/5 hover:text-error transition-colors group"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      )}
      <span className="font-medium">{isPending ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}
