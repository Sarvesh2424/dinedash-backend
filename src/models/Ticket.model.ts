import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  ticketId: { type: String, required: true },
  subject: { type: String, required: true },
  source: {
    type: String,
    enum: ["Restaurant", "Customer", "Delivery"],
    default: "Signature Plates",
  },
  issueType: {
    type: String,
    enum: [
      "Order Issue",
      "Payment",
      "Delivery",
      "Menu",
      "Technical",
      "Billing",
      "Other",
    ],
    default: "Technical",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
  },
  status: {
    type: String,
    enum: ["Open", "In progress", "Resolved"],
    default: "Open",
  },
  orderReference: { type: String, ref: "Order" },
  message: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now() },
  restaurantId: { type: String, required: true },
});

export const Ticket = mongoose.model("Ticket", TicketSchema);
