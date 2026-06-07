"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, AlertCircle, User, Mail, Phone } from "lucide-react";
import { Button } from "@/app/ui/button";
import { profileSchema, type ProfileInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils/cn";
import {
  updateProfileAction,
  type SettingsState,
} from "@/app/account/settings/actions";

export interface ProfileFormProps {
  defaultValues: {
    name: string;
    email: string;
    phone?: string;
  };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [state, setState] = React.useState<SettingsState | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      name: defaultValues.name,
      email: defaultValues.email,
      phone: defaultValues.phone || "",
    },
  });

  const onSubmit = (data: ProfileInput) => {
    setState(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("email", data.email);
      fd.append("phone", data.phone || "");
      const result = await updateProfileAction(null, fd);
      setState(result);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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

      <div>
        <label
          htmlFor="name"
          className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
        >
          Full name
        </label>
        <div className="relative">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
            aria-hidden
          />
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!(errors.name || state?.fieldErrors?.name)}
            className={cn(
              "w-full h-12 pl-10 pr-4 bg-background border rounded-md text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
              errors.name || state?.fieldErrors?.name
                ? "border-error"
                : "border-border"
            )}
            {...register("name")}
          />
        </div>
        {(errors.name || state?.fieldErrors?.name) && (
          <p className="mt-1.5 text-xs text-error">
            {errors.name?.message || state?.fieldErrors?.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
        >
          Email
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
            aria-hidden
          />
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!(errors.email || state?.fieldErrors?.email)}
            className={cn(
              "w-full h-12 pl-10 pr-4 bg-background border rounded-md text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
              errors.email || state?.fieldErrors?.email
                ? "border-error"
                : "border-border"
            )}
            {...register("email")}
          />
        </div>
        {(errors.email || state?.fieldErrors?.email) && (
          <p className="mt-1.5 text-xs text-error">
            {errors.email?.message || state?.fieldErrors?.email}
          </p>
        )}
        <p className="mt-1.5 text-xs text-muted">
          Changing your email requires re-verification in a future update.
        </p>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
        >
          Phone (optional)
        </label>
        <div className="relative">
          <Phone
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
            aria-hidden
          />
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            aria-invalid={!!(errors.phone || state?.fieldErrors?.phone)}
            className={cn(
              "w-full h-12 pl-10 pr-4 bg-background border rounded-md text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
              errors.phone || state?.fieldErrors?.phone
                ? "border-error"
                : "border-border"
            )}
            {...register("phone")}
          />
        </div>
        {(errors.phone || state?.fieldErrors?.phone) && (
          <p className="mt-1.5 text-xs text-error">
            {errors.phone?.message || state?.fieldErrors?.phone}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          size="md"
          shape="full"
          disabled={isPending || !isDirty}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}
