import { Request, Response } from "express";
import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import { returnSuccessResponse } from "../utils/apiout";
import { asyncHandler } from "../utils/asyncHandler";
import {
  addCourier,
  addDish,
  addFlashDeal,
  addOffer,
  deleteCourier,
  deleteDish,
  deleteFlashDeal,
  deleteOffer,
  updateCourier,
  updateDish,
} from "../services/admin.service";
import { v4 } from "uuid";

export const addDishController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, price, category, variants, description, prepTime } = req.body;
    const dishId = v4();

    const newEditor = await addDish({
      name,
      dishId,
      price,
      category,
      variants,
      description,
      prepTime,
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

export const addOfferController = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      promoCode,
      type,
      amountOff,
      percentOff,
      minimumOrder,
      startDate,
      endDate,
    } = req.body;

    const newOffer = await addOffer({
      promoCode,
      type,
      amountOff,
      percentOff,
      minimumOrder,
      startDate,
      endDate,
    });

    returnSuccessResponse(res, StatusCodes.CREATED, newOffer);
  },
);

export const deleteOfferController = asyncHandler(
  async (req: Request, res: Response) => {
    const { offerId } = req.params;

    if (!offerId) {
      throw new AppError(
        "Offer ID is required to delete",
        StatusCodes.BAD_REQUEST,
      );
    }

    const deletedOffer = await deleteOffer(offerId);

    if (!deletedOffer) {
      throw new AppError(
        "Offer not found or already deleted",
        StatusCodes.NOT_FOUND,
      );
    }

    returnSuccessResponse(res, StatusCodes.OK, {
      message: "Offer deleted successfully",
      offerId,
    });
  },
);

export const addCourierController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, status, mobile, rating, image } = req.body;

    const newCourier = await addCourier({
      name,
      status,
      mobile,
      rating: rating ?? 0.0, // Ensures default fallback if not explicitly provided
      image,
    });

    returnSuccessResponse(res, StatusCodes.CREATED, newCourier);
  },
);

export const updateCourierController = asyncHandler(
  async (req: Request, res: Response) => {
    const { courierId } = req.params;
    const { name, status, mobile, rating, image } = req.body;

    if (!courierId) {
      throw new AppError(
        "Courier ID parameter is required for updates",
        StatusCodes.BAD_REQUEST,
      );
    }

    const updatedCourier = await updateCourier(courierId, {
      name,
      status,
      mobile,
      rating,
      image,
    });

    if (!updatedCourier) {
      throw new AppError("Courier profile not found", StatusCodes.NOT_FOUND);
    }

    returnSuccessResponse(res, StatusCodes.OK, updatedCourier);
  },
);

export const deleteCourierController = asyncHandler(
  async (req: Request, res: Response) => {
    const { courierId } = req.params;

    if (!courierId) {
      throw new AppError(
        "Courier ID is required to execute deletion",
        StatusCodes.BAD_REQUEST,
      );
    }

    const deletedCourier = await deleteCourier(courierId);

    if (!deletedCourier) {
      throw new AppError(
        "Courier profile not found or already deleted",
        StatusCodes.NOT_FOUND,
      );
    }

    returnSuccessResponse(res, StatusCodes.OK, {
      message: "Courier profile successfully removed from system",
      courierId,
    });
  },
);

export const addFlashDealController = asyncHandler(
  async (req: Request, res: Response) => {
    const { dish, discount, quantity } = req.body;

    const newFlashDeal = await addFlashDeal({
      dish,
      discount,
      quantity,
    });

    returnSuccessResponse(res, StatusCodes.CREATED, newFlashDeal);
  },
);

export const deleteFlashDealController = asyncHandler(
  async (req: Request, res: Response) => {
    const { flashDealId } = req.params;

    if (!flashDealId) {
      throw new AppError(
        "Flash Deal ID path variable is required",
        StatusCodes.BAD_REQUEST,
      );
    }

    const deletedDeal = await deleteFlashDeal(flashDealId);

    if (!deletedDeal) {
      throw new AppError(
        "Flash deal not found or has already been removed",
        StatusCodes.NOT_FOUND,
      );
    }

    returnSuccessResponse(res, StatusCodes.OK, {
      message: "Flash deal successfully removed",
      flashDealId,
    });
  },
);
