import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { returnSuccessResponse } from "../utils/apiout";
import { StatusCodes } from "../common/errors/statusCodes";
import { registerUser } from "../services/register.service";

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
