import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FlashDealSchema = new Schema({
  flashDealId: { type: String, required: true },
  dish: { type: String, ref: "Dish", required: true },
  discount: { type: Number, required: true },
  duration: { type: Number, required: true },
  quantity: { type: Number, required: true },
  sold: { type: Number, default: 0 },
  active: { type: Boolean, required: true, default: true },
  startedAt: { type: Date, default: Date.now() },
  restaurantId: { type: String, required: true },
});

export const FlashDeal = mongoose.model("FlashDeal", FlashDealSchema);
