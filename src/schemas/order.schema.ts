import { z } from "zod";

export const OrderItemZodSchema = z.object({
  dishId: z.string(),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
});

export const OrderSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID is required"),
    status: z
      .enum(["New", "Preparing", "Ready", "Completed", "Rejected"])
      .default("New"),
    items: z
      .array(OrderItemZodSchema)
      .min(1, "An order must contain at least one item"),
    orderTime: z.coerce.date().default(() => new Date()),
  }),
});