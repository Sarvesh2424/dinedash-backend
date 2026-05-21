import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  mobile: { type: Number, required: true },
  address: { type: String, required: true },
  image: { type: String },
});

export const User = mongoose.model("User", UserSchema);
