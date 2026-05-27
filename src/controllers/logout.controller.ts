import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { returnSuccessResponse } from "../utils/apiout";
import { StatusCodes } from "../common/errors/statusCodes";

export const restaurantLogoutController = asyncHandler(
  async (req: Request, res: Response) => {
    // Clear the HTTP-only cookie by setting its maxAge to 0
    res.cookie("restaurantAuthToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Instantly invalidates the cookie in the browser
    });

    returnSuccessResponse(res, StatusCodes.OK, {
      message: "Logged out successfully. Cookie cleared safely.",
    });
  },
);
