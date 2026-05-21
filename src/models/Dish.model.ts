import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
  }
});

export const Dish = mongoose.model("Dish", DishSchema);
