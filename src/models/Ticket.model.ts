import mongoose, { Schema, Document } from "mongoose";

// Sub-schema for Ticket Attachments
const TicketAttachmentSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

// Sub-schema for Ticket Messages
const TicketMessageSchema = new Schema(
  {
    messageId: { 
      type: String, 
      required: true, 
      default: () => new mongoose.Types.ObjectId().toString() 
    },
    from: { 
      type: String, 
      enum: ["You", "Support", "Customer"], 
      required: true 
    },
    authorName: { type: String },
    text: { type: String, required: true },
    at: { type: Date, default: Date.now },
    internal: { type: Boolean, default: false },
    attachments: { type: [TicketAttachmentSchema], default: [] }
  },
  { _id: false }
);

// Sub-schema for User metadata details
const TicketUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  { _id: false }
);

// Main Ticket Schema
const TicketSchema = new Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    source: {
      type: String,
      enum: ["Restaurant", "Customer", "Delivery"],
      default: "Restaurant",
      required: true,
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
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In progress", "Resolved"],
      default: "Open",
      required: true,
    },
    assignedTo: { type: String, default: "Unassigned" },
    user: { type: TicketUserSchema, required: true },   
    orderReference: { type: String, ref: "Order" },
    restaurantId: { type: String, required: true },
    resolvedAt: { type: Date },
    messages: { type: [TicketMessageSchema], default: [] }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);