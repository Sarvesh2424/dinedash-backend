import { Router } from "express";
import {
  restaurantLoginController,
  userLoginController,
} from "../controllers/login.controller";

const router = Router();

router.post("/user-login", userLoginController);
router.post("/restaurant-login", restaurantLoginController);

export default router;
