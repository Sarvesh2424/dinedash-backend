import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OfferSchema = new Schema({
  offerId: { type: String, required: true },
  promoCode: { type: String, required: true },
  type: {
    type: String,
    enum: ["Flat Amount", "Percent"],
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  amountOff: { type: Number },
  percentOff: { type: Number },
  minimumOrder: { type: Number },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  image: { type: String },
  active: { type: Boolean, default: true },
  restaurantId: { type: String, ref: "Restaurant", required: true },
});

export const Offer = mongoose.model("Offer", OfferSchema);
