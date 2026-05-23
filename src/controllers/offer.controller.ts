import { Request, Response } from "express";
import { returnSuccessResponse } from "../utils/apiout";
import { asyncHandler } from "../utils/asyncHandler";
import { StatusCodes } from "../common/errors/statusCodes";
import { getAllOffers } from "../services/offer.service";

export const getOffersController = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = req.query;

    const offers = await getAllOffers(filters);

    returnSuccessResponse(res, StatusCodes.OK, offers);
  },
);
