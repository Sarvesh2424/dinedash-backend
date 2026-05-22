import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import { Dish } from "../models/Dish.model";

export const getAllDishes = async (filters: Record<string, any> = {}) => {
  try {
    const query = { ...filters };
    const dishes = await Dish.find(query).lean();

    return dishes;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown database read error";
    throw new AppError(
      `Failed to retrieve dishes from the database: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};
