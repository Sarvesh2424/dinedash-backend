import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import { Dish } from "../models/Dish.model";

type DishCategory =
  | "Signature Plates"
  | "Tandoor & Grill"
  | "Small Bites"
  | "Curries"
  | "Breads & Rice"
  | "Drinks";

interface IDish {
  dishId: string;
  name: string;
  price: number;
  category: DishCategory;
  description?: string; // Optional field
  variants: string[];
}

export const addDish = async (data: IDish) => {
  try {
    const existingDish = await Dish.findOne({
      email: data.dishId,
    });
    if (existingDish) {
      throw new AppError(
        "Email already exists. Please use a different email or add a + [organisation name] to your email.",
        StatusCodes.CONFLICT,
      );
    }

    const dataToSave = {
      ...data,
    };
    const newDish = new Dish(dataToSave);
    await newDish.save();
    return newDish;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(
      `Error creating dish: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const updateDish = async (dishId: string | string[], data: Partial<IDish>) => {
  try {
    // findOneAndUpdate automatically finds the dish and applies changes
    const updatedDish = await Dish.findOneAndUpdate(
      { dishId: dishId },
      { $set: data },
      { new: true, runValidators: true }, // new: true returns the modified doc
    );

    return updatedDish; // Will return null if no dish matched the dishId
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(
      `Error updating dish: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const deleteDish = async (dishId: string | string[]) => {
  try {
    const deletedDish = await Dish.findOneAndDelete({ dishId: dishId });

    return deletedDish; // Will return null if no dish matched the dishId
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(
      `Error deleting dish: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};
