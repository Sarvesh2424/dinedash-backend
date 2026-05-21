import { z } from "zod";

export const FlashDealSchema = z.object({
  body: z.object({
    dish: z.string(),
    discount: z.number().positive("Discount must be greater than 0"),
    quantity: z
      .number()
      .int("Quantity must be a whole number")
      .positive("Quantity must be greater than 0"),
  }),
});

export type IFlashDeal = z.infer<typeof FlashDealSchema>["body"];
