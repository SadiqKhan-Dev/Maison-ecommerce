"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, AlertCircle, Mail, Lock } from "lucide-react";
import { Button } from "@/app/ui/button";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils/cn";

const DEMO_EMAIL = "demo@maison.com";
const DEMO_PASSWORD = "maison123";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const authError = searchParams.get("error");

  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(
    authError ? "Invalid email or password. Please try again." : null
  );
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "", callbackUrl },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsPending(true);
    setServerError(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result || result.error) {
        setServerError("Invalid email or password. Please try again.");
        setIsPending(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsPending(false);
    }
  };

  const fillDemo = () => {
    setValue("email", DEMO_EMAIL, { shouldValidate: true, shouldDirty: true });
    setValue("password", DEMO_PASSWORD, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 bg-error/5 border border-error/20 rounded-md"
        >
          <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
          <p className="text-sm text-error">{serverError}</p>
        </div>
      )}

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
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(
              "w-full h-12 pl-10 pr-4 bg-background border rounded-md text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
              errors.email ? "border-error" : "border-border"
            )}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-xs text-error">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted"
          >
            Password
          </label>
          <a
            href="/auth/forgot-password"
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
            aria-hidden
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={cn(
              "w-full h-12 pl-10 pr-12 bg-background border rounded-md text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
              errors.password ? "border-error" : "border-border"
            )}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="mt-1.5 text-xs text-error">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="remember"
          type="checkbox"
          className="h-4 w-4 rounded border-border text-foreground focus:ring-accent focus:ring-offset-0"
        />
        <label
          htmlFor="remember"
          className="text-sm text-muted cursor-pointer select-none"
        >
          Keep me signed in
        </label>
      </div>

      <Button
        type="submit"
        size="lg"
        shape="full"
        className="w-full"
        disabled={isPending || (!isDirty && !isValid)}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <button
        type="button"
        onClick={fillDemo}
        className="w-full text-xs text-muted hover:text-foreground transition-colors py-2 border border-dashed border-border rounded-md"
      >
        Use demo account ({DEMO_EMAIL} / {DEMO_PASSWORD})
      </button>

      <p className="text-xs text-muted text-center">
        Don&apos;t have an account?{" "}
        <a
          href="/auth/register"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Create one
        </a>
      </p>
    </form>
  );
}
