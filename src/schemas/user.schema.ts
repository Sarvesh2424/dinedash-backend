import { z } from "zod";

// Sub-schema to validate individual items inside a user's cart array
export const CartItemZodSchema = z.object({
  dishId: z.string(),

  quantity: z
    .number()
    .int("Quantity must be a whole integer number")
    .positive("Quantity must be greater than 0"),
});

// Main HTTP Request Wrapper Schema for your validation middleware
export const UserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "User name is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    mobile: z.string(),
    address: z.string().min(1, "Delivery address is required"),

    // Optional field, validates as a structured asset URL string if provided
    image: z.string().url("Image must be a valid URL").optional(),

    // Defaults to an empty array if a new user registers without pre-selected items
    cart: z.array(CartItemZodSchema).default([]),
  }),
});

export type ICartItem = z.infer<typeof CartItemZodSchema>;
export type IUser = z.infer<typeof UserSchema>["body"];
