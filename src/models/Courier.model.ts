import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CourierSchema = new Schema({
  courierId: { type: String, required: true },
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["Free", "On Run"],
    required: true,
    default: "Free",
  },
  mobile: { type: String, required: true },
  rating: { type: Number, default: 0.0 },
  image: { type: String },
});

export const Courier = mongoose.model("Courier", CourierSchema);
