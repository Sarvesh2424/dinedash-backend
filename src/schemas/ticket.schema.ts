import { z } from "zod";

export const TicketSchema = z.object({
  body: z.object({
    subject: z
      .string()
      .min(3, "Subject line must be at least 3 characters long"),

    source: z.enum(["Restaurant", "Customer", "Delivery"]).default("Customer"), // Adjust default to match your real-world fallback layout

    issueType: z
      .enum([
        "Order Issue",
        "Payment",
        "Delivery",
        "Menu",
        "Technical",
        "Billing",
        "Other",
      ])
      .default("Technical"),

    priority: z.enum(["Low", "Medium", "High", "Urgent"]),
    status: z.enum(["Open", "In progress", "Resolved"]).default("Open"),
    orderReference: z.string().optional(),

    message: z
      .string()
      .min(
        10,
        "Please provide a more descriptive summary explanation (minimum 10 characters)",
      ),

    updatedAt: z.coerce.date().default(() => new Date()),
    restaurantId: z.string(),
  }),
});

export type ITicket = z.infer<typeof TicketSchema>["body"];
