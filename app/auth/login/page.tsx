import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/app/components/auth/auth-layout";
import { LoginForm } from "@/app/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Maison account.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to view your orders, wishlist, and account."
      image={{
        src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80&seed=auth-login",
        alt: "Editorial fashion image",
      }}
      imageCaption="Maison · Members"
      brandQuote={{
        text: "Considered clothing, considered service. Your account keeps every order, every preference, and every piece you love in one quiet place.",
        author: "The Maison Team",
      }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
