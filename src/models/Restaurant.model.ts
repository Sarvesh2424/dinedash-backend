import mongoose from "mongoose";

const Schema = mongoose.Schema;

const WorkingDaySchema = new Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  status: { type: String, enum: ["Open", "Closed"], required: true },
  startTime: { type: String },
  endTime: { type: String },
});

const RestaurantSchema = new Schema({
  restaurantId: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  cuisine: { type: String, required: true },
  accountHolder: { type: String, required: true },
  accountNumber: { type: String, required: true },
  routing: { type: String, required: true },
  workingHours: { type: [WorkingDaySchema] },
  menu: { type: [String], default: [] },
  offers: { type: [String], ref: "Offer", default: [] },
  dishes: { type: [String], ref: "Dish", default: [] },
  couriers: { type: [String], ref: "Courier", default: [] },
  tickets: { type: [String], ref: "Ticket", default: [] },
  images: { type: [String], default: [] },
});

export const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
