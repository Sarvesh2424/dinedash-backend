import { Request, Response } from "express";
import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import { loginRestaurant, loginUser } from "../services/login.service";
import { asyncHandler } from "../utils/asyncHandler";
import { returnSuccessResponse } from "../utils/apiout";

export const userLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      throw new AppError(
        "Credentials missing. Both mobile and password are required.",
        StatusCodes.BAD_REQUEST,
      );
    }

    const { user, token } = await loginUser(mobile, password);

    // Calculate absolute expiration limit parameter (matching our 7-day service lifespan configuration)
    const cookieExpiryMs = 7 * 24 * 60 * 60 * 1000;

    // Mount structural token value directly onto secure network transmission cookie parameters
    res.cookie("authToken", token, {
      httpOnly: true, // Shield token mapping context scripts from malicious XSS reading tasks
      secure: process.env.NODE_ENV === "production", // Enforce HTTPS-exclusive transmissions in production
      sameSite: "strict", // Mitigate dangerous Cross-Site Request Forgery (CSRF) attempts
      maxAge: cookieExpiryMs, // Life tracking boundary marker setting
    });

    // Provide tracking response object context to the client (omitting raw token from plaintext visible json parameters)
    returnSuccessResponse(res, StatusCodes.OK, { user });
  },
);

export const restaurantLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      throw new AppError(
        "Credentials missing. Both restaurantId and password are required.",
        StatusCodes.BAD_REQUEST,
      );
    }

    const { restaurant, token } = await loginRestaurant(mobile, password);

    // Calculate absolute cookie shelf-life limit (7 days)
    const cookieExpiryMs = 7 * 24 * 60 * 60 * 1000;

    // Mount token payload into secure, HTTP-only web transmission cookie parameters
    res.cookie("restaurantAuthToken", token, {
      httpOnly: true, // Isolates token context strictly away from client XSS reading vectors
      secure: process.env.NODE_ENV === "production", // Enforces SSL/HTTPS-exclusive transmissions in production environments
      sameSite: "strict", // Direct protection mechanism mitigating CSRF attack variations
      maxAge: cookieExpiryMs,
    });

    returnSuccessResponse(res, StatusCodes.OK, { restaurant });
  },
);
