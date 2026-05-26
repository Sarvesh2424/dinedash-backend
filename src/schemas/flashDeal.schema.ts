import { z } from "zod";

export const FlashDealSchema = z.object({
  body: z.object({
    dish: z.string(),
    discount: z.number().positive("Discount must be greater than 0"),
    duration: z.number().positive().int(),
    quantity: z
      .number()
      .int("Quantity must be a whole number")
      .positive("Quantity must be greater than 0"),
    sold: z.number().optional(),
    active: z.boolean().default(true),
    startedAt: z.date().optional(),
  }),
});

export type IFlashDeal = z.infer<typeof FlashDealSchema>["body"];
