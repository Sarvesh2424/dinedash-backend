import { Router } from "express";
import {
  registerRestaurantController,
  userRegisterController,
} from "../controllers/register.controller";
import { validate } from "../middlewares/validate.middleware";
import { UserSchema } from "../schemas/user.schema";
import { RestaurantSchema } from "../schemas/restaurant.schema";

const router = Router();

router.post("/user-register", validate(UserSchema), userRegisterController);
router.post(
  "/restaurant-register",
  validate(RestaurantSchema),
  registerRestaurantController,
);

export default router;
