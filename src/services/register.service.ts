import { AppError } from "../common/errors/api-error";
import { User } from "../models/User.models";
import bcrypt from "bcrypt";
import { IUser } from "../schemas/user.schema";
import { StatusCodes } from "../common/errors/statusCodes";
import { v4 } from "uuid";
import { Restaurant } from "../models/Restaurant.model";
import { IRestaurant } from "../schemas/restaurant.schema";

export const registerUser = async (data: IUser) => {
  try {
    // Prevent account duplication sharing the same mobile phone number
    const existingMobile = await User.findOne({ mobile: data.mobile });
    if (existingMobile) {
      throw new AppError(
        "A user profile is already registered with this mobile number.",
        StatusCodes.CONFLICT,
      );
    }

    // Security Layer: Hash the plaintext password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const userId = v4();

    const finalizedUserData = {
      userId,
      ...data,
      password: hashedPassword,
    };

    const newUser = new User(finalizedUserData);
    await newUser.save();

    return newUser;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const message =
      error instanceof Error ? error.message : "Unknown database exception";
    throw new AppError(
      `Failed to compile user registration: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const registerRestaurant = async (data: IRestaurant) => {
  try {
    // Prevent profile duplication sharing the same mobile contact number
    const existingMobile = await Restaurant.findOne({ mobile: data.mobile });
    if (existingMobile) {
      throw new AppError(
        "A restaurant is already registered using this mobile telephone contact number.",
        StatusCodes.CONFLICT,
      );
    }

    // Security Layer: Hash the plaintext credentials safely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const restaurantId = v4();

    const finalizedRestaurantData = {
      restaurantId,
      ...data,
      password: hashedPassword,
    };

    const newRestaurant = new Restaurant(finalizedRestaurantData);
    await newRestaurant.save();

    return newRestaurant;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const message =
      error instanceof Error ? error.message : "Unknown data-tier error";
    throw new AppError(
      `Failed to compile restaurant registration tracking: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};
