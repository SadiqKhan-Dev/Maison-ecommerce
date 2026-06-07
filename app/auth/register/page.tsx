import type { Metadata } from "next";
import { AuthLayout } from "@/app/components/auth/auth-layout";
import { RegisterForm } from "@/app/components/auth/register-form";
import { registerAction } from "./actions";

export const metadata: Metadata = {
  title: "Create account",
  description: "Join Maison and discover considered clothing for considered lives.",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Maison for faster checkout, order tracking, and a wishlist that travels with you."
      image={{
        src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80&seed=auth-register",
        alt: "Editorial fashion image",
      }}
      imageCaption="Maison · Membership"
      brandQuote={{
        text: "Join the few who choose less, and better. Free shipping over $150, early access to drops, and a 15% welcome offer.",
        author: "Welcome to Maison",
      }}
    >
      <RegisterForm action={registerAction} />
    </AuthLayout>
  );
}
