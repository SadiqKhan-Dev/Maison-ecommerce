import type { Metadata } from "next";
import { auth } from "@/auth";
import { ProfileForm } from "@/app/components/account/profile-form";
import { PreferencesForm } from "./preferences-form";
import { getNotificationPreferences } from "@/lib/auth/users";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Maison profile and preferences.",
};

export default async function AccountSettingsPage() {
  const session = await auth();
  const user = session?.user;
  const prefs = user?.id ? getNotificationPreferences(user.id) : undefined;

  return (
    <div className="space-y-12">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Your profile
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Settings</h1>
        <p className="mt-3 text-muted max-w-prose">
          Update your personal information and how Maison reaches you.
        </p>
      </header>

      <section>
        <div className="mb-6">
          <h2 className="font-display text-2xl">Personal information</h2>
          <p className="text-sm text-muted mt-1">
            This is what we&apos;ll show on your orders and packing slips.
          </p>
        </div>
        <div className="max-w-xl">
          <ProfileForm
            defaultValues={{
              name: user?.name || "",
              email: user?.email || "",
            }}
          />
        </div>
      </section>

      <section className="pt-8 border-t border-border">
        <div className="mb-6">
          <h2 className="font-display text-2xl">Password</h2>
          <p className="text-sm text-muted mt-1">
            Choose a strong password you don&apos;t use anywhere else.
          </p>
        </div>
        <div className="max-w-xl p-6 border border-dashed border-border rounded-lg bg-card">
          <p className="text-sm text-muted">
            Password changes will be available once email verification is
            connected. Until then, your account uses the credentials you signed
            up with.
          </p>
        </div>
      </section>

      <section className="pt-8 border-t border-border">
        <div className="mb-6">
          <h2 className="font-display text-2xl">Preferences</h2>
          <p className="text-sm text-muted mt-1">
            Choose how Maison stays in touch.
          </p>
        </div>
        {prefs ? (
          <PreferencesForm defaultValues={prefs} />
        ) : (
          <p className="text-sm text-muted">Sign in to manage your preferences.</p>
        )}
      </section>

      <section className="pt-8 border-t border-border">
        <div className="mb-6">
          <h2 className="font-display text-2xl text-error">Danger zone</h2>
          <p className="text-sm text-muted mt-1">
            Irreversible actions. Please be sure.
          </p>
        </div>
        <div className="max-w-xl p-6 border border-error/20 rounded-lg bg-error/5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="font-medium">Delete your account</p>
              <p className="text-sm text-muted mt-1 max-w-sm">
                Permanently remove your Maison account, saved addresses, and
                preferences.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="px-4 h-9 text-xs uppercase tracking-widest font-medium border border-error text-error rounded-full opacity-50 cursor-not-allowed"
            >
              Delete account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
