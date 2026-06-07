import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/app/components/auth/auth-layout";
import { Button } from "@/app/ui/button";

export const metadata: Metadata = {
  title: "Check your email",
  description: "We&apos;ve sent you a password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Check your email"
      subtitle="If an account exists for the address you entered, we&apos;ve sent a link to reset your password."
      image={{
        src: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80&seed=auth-forgot",
        alt: "Editorial fashion image",
      }}
      imageCaption="Maison · Account recovery"
      variant="centered"
      footer={
        <Link
          href="/auth/login"
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          &larr; Back to sign in
        </Link>
      }
    >
      <div className="space-y-6 text-sm text-muted">
        <p>
          The link will expire in 30 minutes. If you don&apos;t see the email,
          check your spam folder or try again.
        </p>
        <Button asChild size="lg" shape="full" className="w-full">
          <Link href="/auth/login">Return to sign in</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
