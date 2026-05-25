import { Request, Response } from "express";
import { StatusCodes } from "../common/errors/statusCodes";
import { returnSuccessResponse } from "../utils/apiout";
import { asyncHandler } from "../utils/asyncHandler";
import { getAllOrders, getAllRestaurants, placeOrder, updateUserCart } from "../services/user.service";
import { AppError } from "../common/errors/api-error";

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

export const updateCartController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { cart } = req.body;

    if (!userId) {
      throw new AppError("User ID parameter tracking path is required", StatusCodes.BAD_REQUEST);
    }

    if (!cart || !Array.isArray(cart)) {
      throw new AppError("A structured cart item array is required", StatusCodes.BAD_REQUEST);
    }

    const updatedUser = await updateUserCart(userId, cart);

    if (!updatedUser) {
      throw new AppError("Target user profile not found", StatusCodes.NOT_FOUND);
    }

    returnSuccessResponse(
      res, 
      StatusCodes.OK, 
      updatedUser.cart, 
    );
  }
);

export const getRestaurantsController = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = req.query;

    const restaurants = await getAllRestaurants(filters);

    returnSuccessResponse(
      res, 
      StatusCodes.OK, 
      restaurants, 
    );
  }
);

export const getOrdersController = asyncHandler(
  async (req: Request, res: Response) => {
    // Collect potential dashboard search filters (e.g., userId, restaurantId, status)
    const filters = req.query;

    const orders = await getAllOrders(filters);

    returnSuccessResponse(
      res, 
      StatusCodes.OK, 
      orders, 
    );
  }
);