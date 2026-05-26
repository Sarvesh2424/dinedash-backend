import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderItemDetailSchema = new Schema({
  dishId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  image: { type: String },
});

const UserDetailSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  mobile: { type: Number, required: true },
  address: { type: String },
  image: { type: String },
});

const OrderItemSchema = new Schema({
  dishId: { type: String, ref: "Dish", required: true },
  quantity: { type: Number, required: true },
  dishDetails: { type: OrderItemDetailSchema, required: true },
  notes: { type: String },
});

const OrderSchema = new Schema({
  orderId: { type: String, required: true },
  userId: { type: String, ref: "User", required: true },
  userDetails: { type: UserDetailSchema, required: true },
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
  isUrgent: { type: Boolean, default: false },
  channel: {
    type: String,
    enum: ["Direct", "Aggregator", "Dine-in"],
    default: "Direct",
    required: true,
  },
  courierId: { type: String },
});

export const Order = mongoose.model("Order", OrderSchema);
