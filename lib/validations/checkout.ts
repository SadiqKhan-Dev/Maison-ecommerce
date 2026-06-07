import { z } from "zod";

export const contactSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .transform((v) => v.trim().toLowerCase()),
  marketingOptIn: z.boolean(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const addressSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long")
    .transform((v) => v.trim()),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long")
    .transform((v) => v.trim()),
  addressLine1: z
    .string()
    .min(1, "Address is required")
    .max(120, "Address is too long")
    .transform((v) => v.trim()),
  addressLine2: z
    .string()
    .max(120, "Address line 2 is too long")
    .transform((v) => v.trim())
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .min(1, "City is required")
    .max(80, "City is too long")
    .transform((v) => v.trim()),
  state: z
    .string()
    .min(1, "State or region is required")
    .max(80, "State is too long")
    .transform((v) => v.trim()),
  postcode: z
    .string()
    .min(2, "Postcode is required")
    .max(20, "Postcode is too long")
    .transform((v) => v.trim()),
  country: z
    .string()
    .min(2, "Country is required")
    .max(80, "Country is too long")
    .transform((v) => v.trim()),
  phone: z
    .string()
    .max(30, "Phone number is too long")
    .regex(/^[\d\s+()-]*$/, "Phone number contains invalid characters")
    .transform((v) => v.trim())
    .optional()
    .or(z.literal("")),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutFormSchema = z.object({
  contact: contactSchema,
  shippingAddress: addressSchema,
});

export const cardSchema = z.object({
  number: z
    .string()
    .min(13, "Card number is too short")
    .max(19, "Card number is too long")
    .regex(/^[\d\s]+$/, "Card number can only contain digits and spaces"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/, "Use MM/YY format"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3 or 4 digits"),
  name: z.string().min(2, "Name on card is required").max(80),
});
