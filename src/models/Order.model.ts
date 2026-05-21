import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  dishId: { type: String, ref: "Dish", required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema({
  orderId: { type: String, required: true },
  userId: { type: String, ref: "User", required: true },
  status: {
    type: String,
    enum: ["New", "Preparing", "Ready", "Completed", "Rejected"],
    default: "New",
    required: true,
  },
  items: [OrderItemSchema],
  prepTime: { type: Number, required: true },
  total: { type: Number, required: true },
  orderTime: { type: Date, default: Date.now() },
});

export const Order = mongoose.model("Order", OrderSchema);
