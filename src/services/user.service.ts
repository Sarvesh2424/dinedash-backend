import { v4 } from "uuid";
import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import { Dish } from "../models/Dish.model";
import { Order } from "../models/Order.model";

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
