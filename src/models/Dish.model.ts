import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AddOnSchema = new Schema({
  name: { type: String, ref: "Dish", required: true },
  price: { type: Number, required: true },
  image: { type: String },
});

const DishSchema = new Schema({
  dishId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: [
      "Signature Plates",
      "Tandoor & Grill",
      "Small Bites",
      "Curries",
      "Breads & Rice",
      "Drinks",
    ],
    default: "Signature Plates",
  },
  description: {
    type: String,
  },
  variants: {
    type: Array<String>,
    default: [],
  },
  addOns: { type: [AddOnSchema], default: [] },
  prepTime: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  image: { type: String },
  restaurantId: { type: String, required: true },
  bestSeller: { type: Boolean, default: false },
  available: { type: Boolean, required: true, default: true },
});

export const Dish = mongoose.model("Dish", DishSchema);
