"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, User, Mail, Lock, Check } from "lucide-react";
import { Button } from "@/app/ui/button";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils/cn";

interface RegisterFormProps {
  action: (prevState: RegisterState | null, formData: FormData) => Promise<RegisterState>;
}

export interface RegisterState {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof RegisterInput, string>>;
}

export function RegisterForm({ action }: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [state, setState] = React.useState<RegisterState | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false as unknown as true,
    },
  });

  const password = useWatch({ control, name: "password" }) || "";

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];

  const onSubmit = (data: RegisterInput) => {
    setState(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("name", data.name);
      fd.append("email", data.email);
      fd.append("password", data.password);
      fd.append("confirmPassword", data.confirmPassword);

      const result = await action(null, fd);
      setState(result);

      if (result.ok) {
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (signInResult && !signInResult.error) {
          router.push("/account");
          router.refresh();
        } else {
          router.push("/auth/login?registered=1");
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {state?.error && !state.fieldErrors && (
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
            placeholder="Jane Doe"
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
            placeholder="you@example.com"
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
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
            aria-hidden
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a strong password"
            aria-invalid={!!errors.password}
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
          <p className="mt-1.5 text-xs text-error">{errors.password.message}</p>
        )}
        {password.length > 0 && (
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {passwordRequirements.map((req) => (
              <li
                key={req.label}
                className={cn(
                  "flex items-center gap-2 text-xs transition-colors",
                  req.met ? "text-success" : "text-muted"
                )}
              >
                <Check
                  className={cn(
                    "h-3 w-3 shrink-0",
                    req.met ? "opacity-100" : "opacity-30"
                  )}
                />
                {req.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
        >
          Confirm password
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
            aria-hidden
          />
          <input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            aria-invalid={!!(errors.confirmPassword || state?.fieldErrors?.confirmPassword)}
            className={cn(
              "w-full h-12 pl-10 pr-12 bg-background border rounded-md text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
              errors.confirmPassword || state?.fieldErrors?.confirmPassword
                ? "border-error"
                : "border-border"
            )}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground transition-colors"
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {(errors.confirmPassword || state?.fieldErrors?.confirmPassword) && (
          <p className="mt-1.5 text-xs text-error">
            {errors.confirmPassword?.message ||
              state?.fieldErrors?.confirmPassword}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="acceptTerms"
          className="flex items-start gap-3 cursor-pointer select-none group"
        >
          <input
            id="acceptTerms"
            type="checkbox"
            aria-invalid={!!errors.acceptTerms}
            className="mt-0.5 h-4 w-4 rounded border-border text-foreground focus:ring-accent focus:ring-offset-0"
            {...register("acceptTerms")}
          />
          <span className="text-xs text-muted leading-relaxed">
            I agree to the{" "}
            <a
              href="/terms"
              className="text-foreground underline-offset-4 hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-foreground underline-offset-4 hover:underline"
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1.5 ml-7 text-xs text-error">
            {errors.acceptTerms.message}
          </p>
        )}
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
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-xs text-muted text-center">
        Already have an account?{" "}
        <a
          href="/auth/login"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          Sign in
        </a>
      </p>
    </form>
  );
}
