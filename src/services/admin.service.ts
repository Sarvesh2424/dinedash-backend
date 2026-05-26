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
import { Order } from "../models/Order.model";
import { Ticket } from "../models/Ticket.model";
import { ITicket } from "../schemas/ticket.schema";
import { Restaurant } from "../models/Restaurant.model";
import { IRestaurant } from "../schemas/restaurant.schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { s3 } from "../config/s3";
import type { Multer } from "multer";

type DishCategory =
  | "Signature Plates"
  | "Tandoor & Grill"
  | "Small Bites"
  | "Curries"
  | "Breads & Rice"
  | "Drinks";

interface IDish {
  name: string;
  price: number;
  category: DishCategory;
  description?: string; // Optional field
  variants: string[];
  addOns: { name: string; price: number }[];
  prepTime: number;
  rating: number;
  image?: string;
  restaurantId: string;
  bestSeller?: boolean;
}

export const addDish = async (data: IDish) => {
  try {
    const dishId = v4();
    const restaurant = await Restaurant.findOneAndUpdate(
      { restaurantId: data.restaurantId },
      { $push: { dishes: dishId } },
      { new: true },
    );

    const dataToSave = {
      dishId,
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

    if (!deletedDish) {
      throw new AppError(
        "No offer dound by the given id",
        StatusCodes.NOT_FOUND,
      );
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      {
        restaurantId: deletedDish.restaurantId,
      },
      { $pull: { dishes: dishId } },
    );

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

    const restaurant = await Restaurant.findOneAndUpdate(
      { restaurantId: data.restaurantId },
      { $push: { offers: offerId } },
      { new: true },
    );

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

    if (!deletedOffer) {
      throw new AppError(
        "No offer dound by the given id",
        StatusCodes.NOT_FOUND,
      );
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      {
        restaurantId: deletedOffer.restaurantId,
      },
      { $pull: { offers: offerId } },
    );

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

    const restaurant = await Restaurant.findOneAndUpdate(
      { restaurantId: data.restaurantId },
      { $push: { couriers: courierId } },
      { new: true },
    );

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

    if (!deletedCourier) {
      throw new AppError(
        "No offer dound by the given id",
        StatusCodes.NOT_FOUND,
      );
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      {
        restaurantId: deletedCourier.restaurantId,
      },
      { $pull: { couriers: courierId } },
    );
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

export const getAllOrders = async (filters:Record<string, any> = {}) => {
  try {
    const orders = await Order.find(filters).sort({ orderTime: -1 }).lean(); // .lean() converts documents into lightweight JSON for faster API performance

    return orders;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Database fetch pipeline failure";
    throw new Error(`Failed to retrieve orders record matrix: ${message}`);
  }
};

const ALLOWED_STATUSES = ["New", "Preparing", "Ready", "Completed", "Rejected"];

export const updateOrderStatus = async (
  orderId: string | string[],
  newStatus: string,
) => {
  try {
    // Guard against random strings passing into our database enum fields
    if (!ALLOWED_STATUSES.includes(newStatus)) {
      throw new AppError(
        `Invalid status value. Allowed choices are: ${ALLOWED_STATUSES.join(", ")}`,
        StatusCodes.BAD_REQUEST,
      );
    }

    // Perform atomic update operation
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { $set: { status: newStatus } },
      { new: true, runValidators: true }, // Returns the newly modified object state
    );

    return updatedOrder;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const message =
      error instanceof Error
        ? error.message
        : "Unknown database modification fault";
    throw new AppError(
      `Error modifying order progress state: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const raiseTicket = async (data: ITicket) => {
  try {
    // Data Integrity Check: If an order invoice is referenced, verify it exists
    if (data.orderReference) {
      const parentOrderExists = await Order.findOne({
        orderId: data.orderReference,
      });

      if (!parentOrderExists) {
        throw new AppError(
          `Integrity Verification Failure: Referenced order reference ID '${data.orderReference}' does not exist.`,
          StatusCodes.NOT_FOUND,
        );
      }
    }

    const ticketId = v4();

    const restaurant = await Restaurant.findOneAndUpdate(
      { restaurantId: data.restaurantId },
      { $push: { tickets: ticketId } },
      { new: true },
    );

    const newTicket = new Ticket({ ticketId, ...data });
    await newTicket.save();

    return newTicket;
  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    const message =
      error instanceof Error
        ? error.message
        : "Unknown support database transaction error";
    throw new AppError(
      `Failed to log support ticket: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const updateTicket = async (
  ticketId: string | string[],
  data: Partial<ITicket>,
) => {
  try {
    // Append a fresh system runtime timestamp to track this modification event
    const modifiedPayload = {
      ...data,
      updatedAt: new Date(),
    };

    // Execute atomic update operation matching against our unique string ticketId
    const updatedTicket = await Ticket.findOneAndUpdate(
      { ticketId: ticketId },
      { $set: modifiedPayload },
      { new: true, runValidators: true }, // Returns the modified object and enforces enum lookups
    );

    return updatedTicket;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown database mutation fault";
    throw new AppError(
      `Failed to modify ticket record state: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const updateRestaurantProfile = async (
  restaurantId: string | string[],
  data: Partial<IRestaurant>,
) => {
  try {
    const finalUpdatePayload = { ...data };

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { restaurantId: restaurantId },
      { $set: finalUpdatePayload },
      { new: true, runValidators: true },
    );

    if (updatedRestaurant) {
      const cleanRestaurantObj = updatedRestaurant.toObject();
      return cleanRestaurantObj;
    }

    return null;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown database patch fault";
    throw new AppError(
      `Failed to modify merchant profile state configurations: ${message}`,
      StatusCodes.BAD_REQUEST,
    );
  }
};

export const uploadAndCompressImage = async (file: Express.Multer.File) => {
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!bucketName) {
    throw new AppError(
      "AWS_BUCKET_NAME is missing from your server environment variables.",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  // Extract properties natively supported by the Multer incoming object
  let compressedBuffer = file.buffer;
  const finalMimeType = file.mimetype;
  const originalName = file.originalname.replace(/\s+/g, "_"); // Sanitize spacing blocks

  // Run Lossless Compression using Sharp based on structural type evaluation
  if (file.mimetype === "image/png") {
    compressedBuffer = await sharp(file.buffer)
      .png({ compressionLevel: 9, palette: true, effort: 6 })
      .toBuffer();
  } else if (file.mimetype === "image/webp") {
    compressedBuffer = await sharp(file.buffer)
      .webp({ lossless: true })
      .toBuffer();
  }

  const key = `uploads/dinedash/${Date.now()}-${originalName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: compressedBuffer,
    ContentType: finalMimeType,
    ACL: "public-read", // Guarantees instant browser URL read capabilities
  });

  await s3.send(command);

  return {
    publicUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };
};
