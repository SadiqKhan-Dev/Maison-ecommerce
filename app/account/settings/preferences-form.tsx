"use client";

import * as React from "react";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/app/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  updatePreferencesAction,
  type PreferencesState,
} from "@/app/account/settings/actions";
import type { NotificationPreferences } from "@/lib/auth/users";

interface PreferencesFormProps {
  defaultValues: NotificationPreferences;
}

const PREF_FIELDS: {
  key: keyof NotificationPreferences;
  label: string;
  hint: string;
}[] = [
  {
    key: "order_updates",
    label: "Order updates",
    hint: "Confirmation, shipping, and delivery notifications by email.",
  },
  {
    key: "newsletter",
    label: "Maison newsletter",
    hint: "New arrivals, collections, and stories, sent twice a month.",
  },
  {
    key: "sms_order_updates",
    label: "SMS order updates",
    hint: "Text notifications when your order ships and arrives.",
  },
];

export function PreferencesForm({ defaultValues }: PreferencesFormProps) {
  const [values, setValues] =
    React.useState<NotificationPreferences>(defaultValues);
  const [initialValues] = React.useState<NotificationPreferences>(defaultValues);
  const [state, setState] = React.useState<PreferencesState | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const dirty = PREF_FIELDS.some((f) => values[f.key] !== initialValues[f.key]);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setValues((v) => ({ ...v, [key]: !v[key] }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(null);
    const fd = new FormData();
    for (const f of PREF_FIELDS) {
      if (values[f.key]) fd.append(f.key, "on");
    }
    startTransition(async () => {
      const result = await updatePreferencesAction(null, fd);
      setState(result);
      if (result.ok) {
        // Treat the saved state as the new baseline
        // (a small useState re-init)
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl" noValidate>
      {state?.ok && state.message && (
        <div
          role="status"
          className="flex items-start gap-3 p-4 bg-success/5 border border-success/20 rounded-md"
        >
          <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <p className="text-sm text-success">{state.message}</p>
        </div>
      )}
      {state?.error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-md"
        >
          <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
          <p className="text-sm text-error">{state.error}</p>
        </div>
      )}

      {PREF_FIELDS.map((pref) => {
        const checked = values[pref.key];
        return (
          <label
            key={pref.key}
            htmlFor={`pref-${pref.key}`}
            className="flex items-start gap-3 p-4 border border-border rounded-md bg-card cursor-pointer hover:border-foreground/40 transition-colors"
          >
            <span className="pt-0.5">
              <input
                id={`pref-${pref.key}`}
                type="checkbox"
                checked={checked}
                onChange={() => handleToggle(pref.key)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "h-5 w-9 rounded-full inline-flex items-center px-0.5 transition-colors",
                  checked ? "bg-foreground" : "bg-border"
                )}
              >
                <span
                  className={cn(
                    "h-4 w-4 rounded-full bg-background shadow transition-transform",
                    checked ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </span>
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium">{pref.label}</span>
              <span className="block text-xs text-muted mt-0.5">
                {pref.hint}
              </span>
            </span>
          </label>
        );
      })}

      <div className="pt-2 flex items-center gap-3">
        <Button
          type="submit"
          size="md"
          shape="full"
          disabled={!dirty || isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save preferences"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          shape="full"
          disabled={!dirty || isPending}
          onClick={() => setValues(initialValues)}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
