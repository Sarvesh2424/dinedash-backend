import axios from "axios";
import { AppError } from "../common/errors/api-error";
import { StatusCodes } from "../common/errors/statusCodes";
import CoordinatePair from "../types/coordinatePair.type";

export const getMapboxDeliveryEstimate = async (
  userLoc: CoordinatePair,
  restaurantLoc: CoordinatePair,
) => {
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

  if (!mapboxToken) {
    throw new AppError(
      "Mapbox Access Token missing",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  try {
    const coordinates = `${restaurantLoc.lng},${restaurantLoc.lat};${userLoc.lng},${userLoc.lat}`;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}`;

    const response = await axios.get(url, {
      params: {
        access_token: mapboxToken,
        geometries: "geojson",
      },
    });

    const route = response.data.routes?.[0];

    if (!route) {
      throw new Error("No route found");
    }

    return {
      distanceKm: Number((route.distance / 1000).toFixed(2)),
      durationMinutes: Math.ceil(route.duration / 60),
    };
  } catch (error: any) {
    console.log(error?.response?.data || error);

    throw new AppError(
      `Mapbox directions lookup failed`,
      StatusCodes.BAD_REQUEST,
    );
  }
};