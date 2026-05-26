import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderItemDetailSchema = new Schema({
  dishId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  image: { type: String },
});

const OrderItemSchema = new Schema({
  dishId: { type: String, ref: "Dish", required: true },
  quantity: { type: Number, required: true },
  dishDetails: { type: OrderItemDetailSchema, required: true },
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
