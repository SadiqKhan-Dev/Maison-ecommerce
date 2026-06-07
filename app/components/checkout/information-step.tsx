"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { ChevronRight, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/ui/button";
import { useCheckoutStore } from "@/lib/store/checkoutStore";
import { useCartStore } from "@/lib/store/cartStore";
import {
  contactSchema,
  addressSchema,
  type ContactInput,
  type AddressInput,
} from "@/lib/validations/checkout";
import { cn } from "@/lib/utils/cn";
import type { CheckoutAddress } from "@/lib/checkout/types";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Japan",
  "Australia",
];

export function InformationStep() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const setContact = useCheckoutStore((s) => s.setContact);
  const setShippingAddress = useCheckoutStore((s) => s.setShippingAddress);
  const setBilling = useCheckoutStore((s) => s.setBilling);
  const storedContact = useCheckoutStore((s) => s.contact);
  const storedAddress = useCheckoutStore((s) => s.shippingAddress);
  const setCurrentStep = useCheckoutStore((s) => s.setCurrentStep);
  const items = useCartStore((s) => s.items);

  React.useEffect(() => {
    setCurrentStep("information");
  }, [setCurrentStep]);

  React.useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  const {
    register: registerContact,
    handleSubmit: handleSubmitContact,
    formState: { errors: contactErrors, isValid: contactValid },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: storedContact ?? {
      email: session?.user?.email ?? "",
      marketingOptIn: false,
    },
  });

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    formState: { errors: addressErrors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    mode: "onBlur",
    defaultValues: (storedAddress as AddressInput | null) ?? {
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postcode: "",
      country: "United States",
      phone: "",
    },
  });

  const onSubmit = (contactData: ContactInput) => {
    handleSubmitAddress((addressData) => {
      const cleanAddress: CheckoutAddress = {
        firstName: addressData.firstName,
        lastName: addressData.lastName,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2 || undefined,
        city: addressData.city,
        state: addressData.state,
        postcode: addressData.postcode,
        country: addressData.country,
        phone: addressData.phone || undefined,
      };
      setBilling({ sameAsShipping: true });
      setContact({
        email: contactData.email,
        marketingOptIn: contactData.marketingOptIn,
      });
      setShippingAddress(cleanAddress);
      router.push("/checkout/shipping");
    })();
  };

  return (
    <form onSubmit={handleSubmitContact(onSubmit)} className="space-y-10" noValidate>
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Step 1 of 4
        </p>
        <h1 className="mt-2 font-display text-3xl lg:text-4xl tracking-tight">
          Contact & shipping address
        </h1>
        <p className="mt-2 text-sm text-muted max-w-prose">
          We&apos;ll use these details for order updates and delivery.
          {status === "authenticated" && session.user.email && (
            <span className="block mt-1 text-xs text-success">
              <CheckCircle2 className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
              Signed in as {session.user.email}
            </span>
          )}
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Contact</h2>
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
              aria-invalid={!!contactErrors.email}
              className={cn(
                "w-full h-12 pl-10 pr-4 bg-background border rounded-md text-sm transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
                contactErrors.email ? "border-error" : "border-border"
              )}
              {...registerContact("email")}
            />
          </div>
          {contactErrors.email && (
            <p className="mt-1.5 text-xs text-error">
              {contactErrors.email.message}
            </p>
          )}
        </div>
        <label
          htmlFor="marketingOptIn"
          className="flex items-start gap-3 cursor-pointer select-none"
        >
          <input
            id="marketingOptIn"
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border text-foreground focus:ring-accent focus:ring-offset-0"
            {...registerContact("marketingOptIn")}
          />
          <span className="text-sm text-muted">
            Email me with Maison news, new arrivals, and member-only offers.
          </span>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Shipping address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            id="firstName"
            label="First name"
            autoComplete="given-name"
            error={addressErrors.firstName?.message}
            registration={registerAddress("firstName")}
          />
          <TextField
            id="lastName"
            label="Last name"
            autoComplete="family-name"
            error={addressErrors.lastName?.message}
            registration={registerAddress("lastName")}
          />
        </div>
        <TextField
          id="addressLine1"
          label="Address"
          autoComplete="address-line1"
          error={addressErrors.addressLine1?.message}
          registration={registerAddress("addressLine1")}
        />
        <TextField
          id="addressLine2"
          label="Apartment, suite, etc. (optional)"
          autoComplete="address-line2"
          error={addressErrors.addressLine2?.message}
          registration={registerAddress("addressLine2")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            id="city"
            label="City"
            autoComplete="address-level2"
            error={addressErrors.city?.message}
            registration={registerAddress("city")}
          />
          <TextField
            id="state"
            label="State / Region"
            autoComplete="address-level1"
            error={addressErrors.state?.message}
            registration={registerAddress("state")}
          />
          <TextField
            id="postcode"
            label="Postcode"
            autoComplete="postal-code"
            error={addressErrors.postcode?.message}
            registration={registerAddress("postcode")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="country"
              className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
            >
              Country
            </label>
            <select
              id="country"
              autoComplete="country-name"
              aria-invalid={!!addressErrors.country}
              className={cn(
                "w-full h-12 px-3 bg-background border rounded-md text-sm transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
                addressErrors.country ? "border-error" : "border-border"
              )}
              {...registerAddress("country")}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {addressErrors.country && (
              <p className="mt-1.5 text-xs text-error">
                {addressErrors.country.message}
              </p>
            )}
          </div>
          <TextField
            id="phone"
            label="Phone (optional)"
            type="tel"
            autoComplete="tel"
            error={addressErrors.phone?.message}
            registration={registerAddress("phone")}
          />
        </div>
      </section>

      <div className="flex items-center justify-between gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.push("/cart")}
        >
          &larr; Return to bag
        </Button>
        <Button
          type="submit"
          size="lg"
          shape="full"
          disabled={!contactValid}
        >
          Continue to shipping
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  error?: string | null;
  registration: ReturnType<ReturnType<typeof useForm<AddressInput>>["register"]>;
}

function TextField({
  id,
  label,
  type = "text",
  autoComplete,
  error,
  registration,
}: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[10px] uppercase tracking-[0.2em] font-medium text-muted mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={cn(
          "w-full h-12 px-3 bg-background border rounded-md text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent",
          error ? "border-error" : "border-border"
        )}
        {...registration}
      />
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  );
}
