import { Router } from "express";
import {
  placeOrderController,
  updateCartController,
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { OrderSchema } from "../schemas/order.schema";
import { getDishesController } from "../controllers/dish.controller";
import { getOffersController } from "../controllers/offer.controller";

const router = Router();

router.post("/place-order", validate(OrderSchema), placeOrderController);

router.get("/get-dishes", getDishesController);

router.put("/update-cart/:userId", updateCartController);

router.get("/get-offers", getOffersController);

export default router;
