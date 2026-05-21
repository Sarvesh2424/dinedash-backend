import { v4 } from "uuid";
import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import { Dish } from "../models/Dish.model";
import { Offer } from "../models/Offer.model";
import { IOffer } from "../schemas/offer.schema";
import { Courier } from "../models/Courier.model";
import { ICourier } from "../schemas/courier.schema";
import { FlashDeal } from "../models/FlashDeal.model";
import { IFlashDeal } from "../schemas/flashDeal.schema";

type DishCategory =
  | "Signature Plates"
  | "Tandoor & Grill"
  | "Small Bites"
  | "Curries"
  | "Breads & Rice"
  | "Drinks";

interface IDish {
  dishId: string;
  name: string;
  price: number;
  category: DishCategory;
  description?: string; // Optional field
  variants: string[];
  prepTime: number;
}

export const addDish = async (data: IDish) => {
  try {
    const existingDish = await Dish.findOne({
      email: data.dishId,
    });
    if (existingDish) {
      throw new AppError(
        "Email already exists. Please use a different email or add a + [organisation name] to your email.",
        StatusCodes.CONFLICT,
      );
    }

    const dataToSave = {
      ...data,
    };
    const newDish = new Dish(dataToSave);
    await newDish.save();
    return newDish;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(
      `Error creating dish: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const updateDish = async (
  dishId: string | string[],
  data: Partial<IDish>,
) => {
  try {
    // findOneAndUpdate automatically finds the dish and applies changes
    const updatedDish = await Dish.findOneAndUpdate(
      { dishId: dishId },
      { $set: data },
      { new: true, runValidators: true }, // new: true returns the modified doc
    );

    return updatedDish; // Will return null if no dish matched the dishId
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(
      `Error updating dish: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const deleteDish = async (dishId: string | string[]) => {
  try {
    const deletedDish = await Dish.findOneAndDelete({ dishId: dishId });

    return deletedDish; // Will return null if no dish matched the dishId
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(
      `Error deleting dish: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const addOffer = async (data: IOffer) => {
  try {
    const existingPromo = await Offer.findOne({
      promoCode: data.promoCode,
    });
    if (existingPromo) {
      throw new AppError(
        "This promo code is already taken. Please pick a unique promotional name.",
        StatusCodes.CONFLICT,
      );
    }

    const offerId = v4();

    // Construct the Mongoose entity and commit it safely
    const newOffer = new Offer({ offerId, ...data });
    await newOffer.save();

    return newOffer;
  } catch (error: unknown) {
    // If the error was manually raised inside our business logic rules above, pass it through directly
    if (error instanceof AppError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Unknown data tier malfunction";
    throw new AppError(
      `Database exception creating offer: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const deleteOffer = async (offerId: string | string[]) => {
  try {
    const deletedOffer = await Offer.findOneAndDelete({ offerId: offerId });

    return deletedOffer; // Will return null to the controller if no offer matched
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AppError(
      `Error deleting offer from database: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const addCourier = async (data: ICourier) => {
  try {
    // Prevent the same telephone number from creating duplicate profiles
    const existingMobile = await Courier.findOne({ mobile: data.mobile });
    if (existingMobile) {
      throw new AppError(
        "A courier is already registered with this mobile number.",
        StatusCodes.CONFLICT,
      );
    }

    const courierId = v4();

    // Assemble and commit to database
    const newCourier = new Courier({ courierId, ...data });
    await newCourier.save();

    return newCourier;
  } catch (error: unknown) {
    // If the error was manually bubble-raised up by our checks above, pass it through directly
    if (error instanceof AppError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Unknown database fault";
    throw new AppError(
      `Error creating courier profile: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const updateCourier = async (
  courierId: string | string[],
  data: Partial<ICourier>,
) => {
  try {
    // Optional Check: If the request is attempting to modify a mobile number,
    // verify it doesn't create a duplication conflict with an existing profile.
    if (data.mobile) {
      const duplicateMobile = await Courier.findOne({
        mobile: data.mobile,
        courierId: { $ne: courierId }, // Not equal to this current courier
      });

      if (duplicateMobile) {
        throw new AppError(
          "Another courier profile is already using this mobile number",
          StatusCodes.CONFLICT,
        );
      }
    }

    // Execute atomic update operation
    const updatedCourier = await Courier.findOneAndUpdate(
      { courierId: courierId },
      { $set: data },
      { new: true, runValidators: true }, // Return modified doc and check schema types
    );

    return updatedCourier;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const message =
      error instanceof Error ? error.message : "Unknown database error";
    throw new AppError(
      `Error modifying courier record: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const deleteCourier = async (courierId: string | string[]) => {
  try {
    const deletedCourier = await Courier.findOneAndDelete({
      courierId: courierId,
    });
    return deletedCourier;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    throw new AppError(
      `Error deleting courier profile from database: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const addFlashDeal = async (data: IFlashDeal) => {
  try {
    // Foreign Key Check: Make sure the target dish exists before creating a deal for it
    const parentDishExists = await Dish.findOne({ dishId: data.dish });
    if (!parentDishExists) {
      throw new AppError(
        "Referenced dish not found. Cannot attach a flash deal to a non-existent item.",
        StatusCodes.NOT_FOUND,
      );
    }

    // Optional business logic check: Prevent active duplicate deals on the exact same dish item
    const duplicateDeal = await FlashDeal.findOne({ dish: data.dish });
    if (duplicateDeal) {
      throw new AppError(
        "An active flash deal is already running for this dish.",
        StatusCodes.CONFLICT,
      );
    }

    const flashDealId = v4();

    const newFlashDeal = new FlashDeal({ flashDealId, ...data });
    await newFlashDeal.save();

    return newFlashDeal;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const message =
      error instanceof Error ? error.message : "Unknown data tier exception";
    throw new AppError(
      `Error establishing flash deal: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const deleteFlashDeal = async (flashDealId: string | string[]) => {
  try {
    const deletedDeal = await FlashDeal.findOneAndDelete({
      flashDealId: flashDealId,
    });
    return deletedDeal;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown data tier malfunction";
    throw new AppError(
      `Database exception wiping flash deal record: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};
