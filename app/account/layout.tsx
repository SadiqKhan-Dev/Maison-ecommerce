import * as React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Container } from "@/app/ui/container";
import { AccountSidebar } from "@/app/components/account/account-sidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/account");
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : session.user.email
      ? session.user.email.slice(0, 2).toUpperCase()
      : "M";

  return (
    <Container size="xl" className="py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16">
        <AccountSidebar
          userName={session.user.name}
          userEmail={session.user.email}
          initials={initials}
        />
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
