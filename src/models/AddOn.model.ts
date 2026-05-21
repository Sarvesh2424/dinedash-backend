import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AddOnSchema = new Schema({
  addOnId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export const AddOn = mongoose.model("AddOn", AddOnSchema);
