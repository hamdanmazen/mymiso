import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  preferredLanguage: z.string().default("en"),
  preferredCurrency: z.string().default("USD"),
});

export const sellerOnboardingSchema = z.object({
  shopName: z.string().min(3, "Shop name must be at least 3 characters"),
  shopSlug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  shopDescription: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
});

export const addressSchema = z.object({
  label: z.string().default("Home"),
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  streetAddress: z.string().min(5, "Street address is required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(3, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  isDefault: z.boolean().default(false),
});

export const checkoutSchema = z.object({
  addressId: z.string().min(1, "Please select a shipping address"),
  paymentMethod: z.enum(["whish", "tap", "cod"]),
  shippingSelections: z.record(z.string(), z.string()),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().max(100, "Title must be under 100 characters").optional(),
  body: z.string().max(2000, "Review must be under 2000 characters").optional(),
  images: z.array(z.string()).max(5, "Maximum 5 images allowed").optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type SellerOnboardingInput = z.infer<typeof sellerOnboardingSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export const productFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  compareAtPrice: z.number().positive().optional(),
  categoryId: z.string().optional(),
  sku: z.string().optional(),
  stockQuantity: z.number().int().min(0, "Stock cannot be negative").default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  shippingWeight: z.number().positive().optional(),
  shippingFree: z.boolean().default(false),
  shippingOriginCountry: z.string().optional(),
});

export const shopSettingsSchema = z.object({
  shopName: z.string().min(3, "Shop name must be at least 3 characters"),
  shopSlug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  shopDescription: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
});

export const orderStatusUpdateSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["confirmed", "processing", "shipped", "delivered", "cancelled"]),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().url().optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ProductFormInput = z.infer<typeof productFormSchema>;
export type ShopSettingsInput = z.infer<typeof shopSettingsSchema>;
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
