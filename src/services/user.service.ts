import { v4 } from "uuid";
import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import { Dish } from "../models/Dish.model";
import { Order } from "../models/Order.model";
import { User } from "../models/User.models";
import { ICartItem } from "../schemas/user.schema";
import { Restaurant } from "../models/Restaurant.model";

interface IOrder {
  userId: string;
  items: { dishId: string; quantity: number }[];
}

export const placeOrder = async (data: IOrder) => {
  try {
    let calculatedTotal = 0;
    let calculatedPrepTime = 0;

    // Pricing Engine verification: Loop over the basket array items securely
    for (const item of data.items) {
      const liveDishData = await Dish.findOne({ dishId: item.dishId });

      if (!liveDishData) {
        throw new AppError(
          `Verification failure: Dish item reference '${item.dishId}' does not exist.`,
          StatusCodes.NOT_FOUND,
        );
      }
      calculatedTotal += liveDishData.price * item.quantity;
      calculatedPrepTime += liveDishData.prepTime;
    }

    const orderId = v4();
    const finalizedOrderPayload = {
      orderId,
      ...data,
      status: "New",
      total: Number(calculatedTotal.toFixed(2)),
      prepTime: Number(calculatedPrepTime.toFixed(2)),
      orderTime: new Date(),
    };

    const newOrder = new Order(finalizedOrderPayload);
    await newOrder.save();

    return newOrder;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const message =
      error instanceof Error ? error.message : "Unknown order engine failure";
    throw new AppError(
      `Order Processing Aborted: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const updateUserCart = async (
  userId: string | string[],
  incomingCartItems: ICartItem[],
) => {
  try {
    // 1. Data Integrity Validation: Check that every item in the cart exists
    for (const item of incomingCartItems) {
      const parentDishExists = await Dish.findOne({ dishId: item.dishId });

      if (!parentDishExists) {
        throw new AppError(
          `Cart Integrity Failure: Referenced item ID '${item.dishId}' is invalid or no longer exists.`,
          StatusCodes.NOT_FOUND,
        );
      }
    }

    // Perform atomic update operation on the target user's cart field
    const updatedUser = await User.findOneAndUpdate(
      { userId: userId },
      { $set: { cart: incomingCartItems } },
      { new: true, runValidators: true }, // Returns modified doc, running types checking evaluations
    );

    return updatedUser;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const message =
      error instanceof Error
        ? error.message
        : "Unknown database modification fault";
    throw new AppError(
      `Error syncing shopping cart status: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const getAllRestaurants = async (filters: Record<string, any> = {}) => {
  try {
    // Execute lookup query while strictly protecting sensitive data fields
    const restaurants = await Restaurant.find(filters)
      .select("-password -accountHolder -accountNumber -routing") // Security projection filter
      .lean(); // Optimizes query memory footprint for read-only streams

    return restaurants;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown database read error";
    throw new AppError(
      `Failed to compile restaurant directory listings: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const getAllOrders = async (filters: Record<string, any> = {}) => {
  try {
    // Execute lookup query, sorting by newest records first
    const orders = await Order.find(filters)
      .sort({ createdAt: -1 })
      .lean();

    return orders;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown database read error";
    throw new AppError(
      `Failed to compile order ledger summaries: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};
