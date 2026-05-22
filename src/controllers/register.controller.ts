import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { returnSuccessResponse } from "../utils/apiout";
import { StatusCodes } from "../common/errors/statusCodes";
import { registerRestaurant, registerUser } from "../services/register.service";

export const userRegisterController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, password, mobile, address, image, cart } = req.body;

    const newUser = await registerUser({
      name,
      password,
      mobile,
      address,
      image,
      cart: cart ?? [],
    });

    returnSuccessResponse(res, StatusCodes.CREATED, newUser);
  },
);

export const registerRestaurantController = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      password,
      mobile,
      address,
      cuisine,
      accountHolder,
      accountNumber,
      routing,
      workingHours,
    } = req.body;

    const newRestaurant = await registerRestaurant({
      name,
      password,
      mobile,
      address,
      cuisine,
      accountHolder,
      accountNumber,
      routing,
      workingHours: workingHours ?? [], // Fallback to an empty array if hours aren't provided yet
      menu:[]
    });

    returnSuccessResponse(res, StatusCodes.CREATED, newRestaurant);
  },
);
