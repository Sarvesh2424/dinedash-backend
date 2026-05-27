import { Router } from "express";
import {
  restaurantLoginController,
  userLoginController,
} from "../controllers/login.controller";
import { restaurantLogoutController } from "../controllers/logout.controller";

const router = Router();

router.post("/user-logout", userLoginController);
router.post("/restaurant-logout", restaurantLogoutController);

export default router;
