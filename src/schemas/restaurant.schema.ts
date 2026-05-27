import { z } from "zod";

// Sub-schema to validate individual operational working days
export const WorkingDayZodSchema = z.object({
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),

  status: z.enum(["Open", "Closed"]),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const RestaurantSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Restaurant business name is required"),

    password: z.string().min(6, "Password must be at least 6 characters long"),
    ownerName: z.string(),
    email: z.string(),

    // Validates mobile numbers (e.g., standard 10 digits or E.164 formats)
    mobile: z
      .string()
      .min(1, "Mobile number cannot be blank")
      .regex(/^\+?[1-9]\d{1,14}$|^[0-9]{10}$/, "Invalid mobile number format"),

    address: z.string().min(1, "Physical storefront address is required"),

    cuisine: z
      .string()
      .min(1, "Food cuisine specialization classification is required"),

    // Bank Account Deposit Verification Info
    accountHolder: z
      .string()
      .min(1, "Merchant billing legal account holder name is required"),

    accountNumber: z
      .string()
      .min(4, "Account number is too short")
      .regex(/^\d+$/, "Account number must contain digits only"),

    routing: z.string().min(1, "Routing code cannot be blank"),

    // Full week array validation scheme layout parameters mapping
    workingHours: z.array(WorkingDayZodSchema).default([]),
    menu: z.array(z.string()).default([]),
    offers: z.array(z.string()).default([]),
    dishes: z.array(z.string()).default([]),
    couriers: z.array(z.string()).default([]),
    tickets: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    rating: z.number().optional().default(0.0),
    flashText: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export type IWorkingDay = z.infer<typeof WorkingDayZodSchema>;
export type IRestaurant = z.infer<typeof RestaurantSchema>["body"];
