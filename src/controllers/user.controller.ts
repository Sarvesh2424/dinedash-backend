import { Request, Response } from "express";
import { StatusCodes } from "../common/errors/statusCodes";
import { returnSuccessResponse } from "../utils/apiout";
import { asyncHandler } from "../utils/asyncHandler";
import { placeOrder } from "../services/user.service";

export const placeOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId, userId, items, prepTime } = req.body;

    const newOrder = await placeOrder({
      userId,
      items,
    });

    returnSuccessResponse(res, StatusCodes.CREATED, newOrder);
  }
);