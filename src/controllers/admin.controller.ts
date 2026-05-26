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
  raiseTicket,
  updateCourier,
  updateDish,
  updateOrderStatus,
  updateRestaurantProfile,
  updateTicket,
  uploadAndCompressImage,
} from "../services/admin.service";

export const addDishController = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      price,
      category,
      variants,
      addOns,
      description,
      prepTime,
      rating,
      image,
      restaurantId,
    } = req.body;

    const newEditor = await addDish({
      name,
      price,
      category,
      variants,
      addOns,
      description,
      prepTime,
      rating,
      image,
      restaurantId,
      bestSeller: false,
    });
    returnSuccessResponse(res, StatusCodes.CREATED, newEditor);
  },
);

export const updateDishController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("hellooo");
    const { dishId } = req.params; // Get id from URL params
    const { name, price, category, variants, description, bestSeller } =
      req.body;

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
      bestSeller,
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
      name,
      description,
      amountOff,
      percentOff,
      minimumOrder,
      startDate,
      endDate,
      image,
      restaurantId,
    } = req.body;

    const newOffer = await addOffer({
      promoCode,
      type,
      name,
      description,
      amountOff,
      percentOff,
      minimumOrder,
      startDate,
      endDate,
      image,
      restaurantId,
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
    const { name, status, mobile, rating, image, restaurantId } = req.body;

    const newCourier = await addCourier({
      name,
      status,
      mobile,
      rating: rating ?? 0.0, // Ensures default fallback if not explicitly provided
      image,
      restaurantId,
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

export const updateOrderController = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId) {
      throw new AppError(
        "Order ID parameter is required",
        StatusCodes.BAD_REQUEST,
      );
    }

    if (!status) {
      throw new AppError(
        "New order status value is required",
        StatusCodes.BAD_REQUEST,
      );
    }

    // Call service layer to process status transitions safely
    const updatedOrder = await updateOrderStatus(orderId, status);

    if (!updatedOrder) {
      throw new AppError(
        "Target order record not found",
        StatusCodes.NOT_FOUND,
      );
    }

    returnSuccessResponse(res, StatusCodes.OK, updatedOrder);
  },
);

export const raiseTicketController = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      subject,
      source,
      issueType,
      priority,
      orderReference,
      message,
      restaurantId,
    } = req.body;

    const newTicket = await raiseTicket({
      subject,
      source,
      issueType,
      priority,
      status: "Open",
      orderReference,
      message,
      updatedAt: new Date(),
      restaurantId,
    });

    returnSuccessResponse(res, StatusCodes.CREATED, newTicket);
  },
);

export const updateTicketController = asyncHandler(
  async (req: Request, res: Response) => {
    const { ticketId } = req.params;
    const { status, priority, message, subject } = req.body;

    if (!ticketId) {
      throw new AppError(
        "Ticket ID path variable is required",
        StatusCodes.BAD_REQUEST,
      );
    }

    const updatedTicket = await updateTicket(ticketId, {
      status,
      priority,
      message,
      subject,
    });

    if (!updatedTicket) {
      throw new AppError(
        "Target support ticket profile not found",
        StatusCodes.NOT_FOUND,
      );
    }

    returnSuccessResponse(res, StatusCodes.OK, updatedTicket);
  },
);

export const updateRestaurantController = asyncHandler(
  async (req: Request, res: Response) => {
    const { restaurantId } = req.params;

    const updatePayload = req.body;

    if (!restaurantId) {
      throw new AppError(
        "Restaurant ID path parameter tracking slug is required",
        StatusCodes.BAD_REQUEST,
      );
    }

    if (!updatePayload || Object.keys(updatePayload).length === 0) {
      throw new AppError(
        "Update payload content data block cannot be empty",
        StatusCodes.BAD_REQUEST,
      );
    }

    const updatedRestaurant = await updateRestaurantProfile(
      restaurantId,
      updatePayload,
    );

    if (!updatedRestaurant) {
      throw new AppError(
        "Target restaurant profile not found",
        StatusCodes.NOT_FOUND,
      );
    }

    returnSuccessResponse(res, StatusCodes.OK, updatedRestaurant);
  },
);

export const uploadImageController = asyncHandler(
  async (req: Request, res: Response) => {
    // Check if the Multer parsing engine populated the file interceptor object
    if (!req.file) {
      throw new AppError(
        "No file detected. Please attach an image under the 'image' field key.",
        StatusCodes.BAD_REQUEST,
      );
    }

    const uploadResult = await uploadAndCompressImage(req.file);

    returnSuccessResponse(res, StatusCodes.CREATED, uploadResult);
  },
);
