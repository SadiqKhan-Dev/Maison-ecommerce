"use server";

import { createUser, findUserByEmail } from "@/lib/auth/users";
import { registerSchema } from "@/lib/validations/auth";
import type { RegisterState } from "@/app/components/auth/register-form";

export async function registerAction(
  _prev: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: RegisterState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<RegisterState["fieldErrors"]>;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, fieldErrors };
  }

  if (findUserByEmail(parsed.data.email)) {
    return {
      ok: false,
      fieldErrors: { email: "An account with this email already exists." },
    };
  }

  const result = createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (!result.ok) {
    return { ok: false, error: "We couldn't create your account. Please try again." };
  }

  return { ok: true };
}
