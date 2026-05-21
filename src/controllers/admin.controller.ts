import { Request, Response } from "express";
import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import { returnSuccessResponse } from "../utils/apiout";
import { asyncHandler } from "../utils/asyncHandler";
import { addDish, deleteDish, updateDish } from "../services/admin.service";
import { v4 } from "uuid";

export const addDishController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, price, category, variants, description } = req.body;

    if (!name) {
      throw new AppError("Name is required", StatusCodes.BAD_REQUEST);
    }
    const dishId = v4();

    const newEditor = await addDish({
      name,
      dishId,
      price,
      category,
      variants,
      description,
    });
    returnSuccessResponse(res, StatusCodes.CREATED, newEditor);
  },
);

export const updateDishController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("hellooo");
    const { dishId } = req.params; // Get id from URL params
    const { name, price, category, variants, description } = req.body;

    console.log("hello");
    // Check if the target dish exists/id is provided
    if (!dishId) {
      throw new AppError(
        "Dish ID is required to update",
        StatusCodes.BAD_REQUEST,
      );
    }

    // Pass the ID and the new data to your service layer
    const updatedDish = await updateDish(dishId, {
      name,
      price,
      category,
      variants,
      description,
    });

    // Handle case where service couldn't find the dish to update
    if (!updatedDish) {
      throw new AppError("Dish not found", StatusCodes.NOT_FOUND);
    }

    returnSuccessResponse(res, StatusCodes.OK, updatedDish);
  },
);

export const deleteDishController = asyncHandler(
  async (req: Request, res: Response) => {
    const { dishId } = req.params;

    if (!dishId) {
      throw new AppError(
        "Dish ID is required to delete",
        StatusCodes.BAD_REQUEST,
      );
    }

    const deletedDish = await deleteDish(dishId);

    if (!deletedDish) {
      throw new AppError(
        "Dish not found or already deleted",
        StatusCodes.NOT_FOUND,
      );
    }

    // You can return the deleted item details or a simple confirmation object
    returnSuccessResponse(res, StatusCodes.OK, {
      message: "Dish deleted successfully",
      dishId,
    });
  },
);
