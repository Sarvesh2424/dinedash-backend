import { z } from "zod";

export const CourierSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    status: z.enum(["Free", "On Run"]).default("Free"),
    // Validates phone numbers (supports formats like +123456789, 10 digits, dashes, etc.)
    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .regex(
        /^\+?[1-9]\d{1,14}$|^[0-9]{10}$/,
        "Invalid mobile number format"
      ),

    rating: z
      .number()
      .min(0, "Rating cannot be lower than 0")
      .max(5, "Rating cannot be higher than 5")
      .default(0.0),

    // Expects a valid image asset URL string if provided
    image: z.string().url("Image must be a valid URL").optional(),
  }),
});

export type ICourier = z.infer<typeof CourierSchema>["body"];