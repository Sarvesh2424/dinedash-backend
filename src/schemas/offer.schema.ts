import { z } from "zod";

export const OfferSchema = z
  .object({
    body: z.object({
      promoCode: z.string().min(1),
      type: z.enum(["Flat Amount", "Percent"]),
      name: z.string().min(1),
      description: z.string().optional(),
      amountOff: z.number().positive().optional(),
      percentOff: z.number().min(1).max(100).optional(),
      minimumOrder: z.number().nonnegative().optional(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      image: z.string().optional(),
      restaurantId: z.string(),
    }),
  })
  // Custom Validation: Ensures the data makes logical sense based on the type
  .refine(
    (data) => {
      if (
        data.body.type === "Flat Amount" &&
        data.body.amountOff === undefined
      ) {
        return false;
      }
      if (data.body.type === "Percent" && data.body.percentOff === undefined) {
        return false;
      }
      return true;
    },
    {
      message:
        "amountOff is required for 'Flat Amount' type, and percentOff is required for 'Percent' type",
      path: ["type"], // Highlights the type/discount fields in the error response
    },
  )
  //  Custom Validation: Ensures the promotion doesn't end before it starts
  .refine((data) => data.body.endDate >= data.body.startDate, {
    message: "End date must be greater than or equal to start date",
    path: ["endDate"],
  });

type Offer = z.infer<typeof OfferSchema>;

export type IOffer = Offer["body"];
