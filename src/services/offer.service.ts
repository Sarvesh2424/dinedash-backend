import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import { Offer } from "../models/Offer.model";

export const getAllOffers = async (filters: Record<string, any> = {}) => {
  try {
    const offers = await Offer.find(filters).sort({ endDate: 1 }).lean();
    return offers;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown database read error";
    throw new AppError(
      `Failed to retrieve promotional offer details: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};
