import { z } from "zod";

export const DishSchema = z.object({
  name: z.string().min(1),

  price: z.number().positive("Price must be greater than 0"), // Optional, but usually good practice for pricing

  category: z
    .enum([
      "Signature Plates",
      "Tandoor & Grill",
      "Small Bites",
      "Curries",
      "Breads & Rice",
      "Drinks",
    ])
    .default("Signature Plates"),

  description: z.string().optional(),

  variants: z.array(z.string()).default([]),
});
