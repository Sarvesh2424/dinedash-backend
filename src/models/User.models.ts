import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  dishId: { type: String, ref: "Dish", required: true },
  quantity: { type: Number, required: true },
});

const UserSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String },
  cart: { type: [CartItemSchema], default: [] },
});

export const User = mongoose.model("User", UserSchema);
