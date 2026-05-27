import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
    internal: { type: Boolean, default: false }
  },
  { _id: false } // Prevents Mongoose from generating a redundant secondary nested _id
);

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
    orderReference: { type: String, ref: "Order" },
    restaurantId: { type: String, required: true },

    messages: { type: [TicketMessageSchema], default: [] }
  },
  {
    timestamps: true, // Manages native 'createdAt' and 'updatedAt' constraints automatically
  }
);

export const Ticket = mongoose.model("Ticket", TicketSchema);
