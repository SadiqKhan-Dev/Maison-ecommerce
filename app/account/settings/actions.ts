"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  updateUser,
  findUserByEmail,
  updateNotificationPreferences,
  type NotificationPreferences,
} from "@/lib/auth/users";
import { profileSchema } from "@/lib/validations/auth";

export interface SettingsState {
  ok: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone", string>>;
}

export async function updateProfileAction(
  _prev: SettingsState | null,
  formData: FormData
): Promise<SettingsState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in to update your profile." };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: SettingsState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<SettingsState["fieldErrors"]>;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, fieldErrors };
  }

  const current = findUserByEmail(session.user.email ?? "");
  if (parsed.data.email !== current?.email) {
    const conflict = findUserByEmail(parsed.data.email);
    if (conflict && conflict.id !== session.user.id) {
      return {
        ok: false,
        fieldErrors: { email: "That email is already in use." },
      };
    }
  }

  updateUser(session.user.id, {
    name: parsed.data.name,
    email: parsed.data.email,
  });

  revalidatePath("/account");
  revalidatePath("/account/settings");

  return { ok: true, message: "Your profile has been updated." };
}

export interface PreferencesState {
  ok: boolean;
  message?: string;
  error?: string;
}

export async function updatePreferencesAction(
  _prev: PreferencesState | null,
  formData: FormData
): Promise<PreferencesState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "You must be signed in to update preferences." };
  }

  const next: Partial<NotificationPreferences> = {};
  for (const key of ["order_updates", "newsletter", "sms_order_updates"] as const) {
    const raw = formData.get(key);
    next[key] = raw === "on" || raw === "true";
  }

  updateNotificationPreferences(session.user.id, next);

  revalidatePath("/account/settings");

  return { ok: true, message: "Your preferences have been saved." };
}
