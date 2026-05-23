import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import { Restaurant } from "../models/Restaurant.model";
import { User } from "../models/User.models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginUser = async (mobile: string, plainTextPass: string) => {
  try {
    // Check account existence matching your tracking key identifier index
    const userRecord = await User.findOne({ mobile: mobile });

    if (!userRecord) {
      throw new AppError(
        "Invalid User ID tracking code or password.",
        StatusCodes.UNAUTHORIZED,
      );
    }

    // Evaluate password authenticity state via bcrypt comparison
    const isPasswordValid = await bcrypt.compare(
      plainTextPass,
      userRecord.password,
    );
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid User ID tracking code or password.",
        StatusCodes.UNAUTHORIZED,
      );
    }

    const tokenSecret =
      process.env.JWT_SECRET || "SUPER_TRANSACTIONAL_JWT_DEALER_SECRET";
    const token = jwt.sign(
      { userId: userRecord.userId, name: userRecord.name },
      tokenSecret,
      { expiresIn: "7d" }, // Token remains active for a 7-day rolling window
    );

    return { user: userRecord, token };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error ? error.message : "Internal login engine error";
    throw new AppError(`Login aborted: ${message}`, StatusCodes.BAD_REQUEST);
  }
};

export const loginRestaurant = async (
  mobile: string,
  plainTextPass: string,
) => {
  try {
    // Locate the merchant account inside the collection
    const restaurantRecord = await Restaurant.findOne({ mobile: mobile });

    if (!restaurantRecord) {
      throw new AppError(
        "Invalid Restaurant ID tracking code or password.",
        StatusCodes.UNAUTHORIZED,
      );
    }

    // Evaluate credential password authenticity via bcrypt comparison
    const isPasswordValid = await bcrypt.compare(
      plainTextPass,
      restaurantRecord.password,
    );
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid Restaurant ID tracking code or password.",
        StatusCodes.UNAUTHORIZED,
      );
    }

    // Secure Authentication: Generate JWT token containing business tracking parameters
    const tokenSecret =
      process.env.JWT_SECRET || "SUPER_TRANSACTIONAL_JWT_DEALER_SECRET";
    const token = jwt.sign(
      {
        restaurantId: restaurantRecord.restaurantId,
        name: restaurantRecord.name,
        role: "merchant",
      },
      tokenSecret,
      { expiresIn: "7d" }, // Active session window of 7 days
    );

    return { restaurant: restaurantRecord, token };
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;
    const message =
      error instanceof Error
        ? error.message
        : "Internal restaurant login engine error";
    throw new AppError(`Login aborted: ${message}`, StatusCodes.BAD_REQUEST);
  }
};
