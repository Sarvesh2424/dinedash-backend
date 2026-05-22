import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { returnSuccessResponse } from "../utils/apiout";
import { StatusCodes } from "../common/errors/statusCodes";
import { getAllDishes } from "../services/dish.service";

export const getDishesController = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = req.query;

    const dishes = await getAllDishes(filters);

    returnSuccessResponse(
      res, 
      StatusCodes.OK, 
      dishes
    );
  }
);