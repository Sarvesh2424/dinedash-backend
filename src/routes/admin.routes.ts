import { Router } from "express";
import {
  addCourierController,
  addDishController,
  addFlashDealController,
  addOfferController,
  deleteCourierController,
  deleteDishController,
  deleteFlashDealController,
  deleteOfferController,
  updateCourierController,
  updateDishController,
  updateOrderController,
} from "../controllers/admin.controller";
import { validate } from "../middlewares/validate.middleware";
import { DishSchema } from "../schemas/dish.schema";
import { OfferSchema } from "../schemas/offer.schema";
import { CourierSchema } from "../schemas/courier.schema";
import { FlashDealSchema } from "../schemas/flashDeal.schema";
import { getDishesController } from "../controllers/dish.controller";

const router = Router();

router.get("/get-dishes", getDishesController);
router.post("/add-dish", validate(DishSchema), addDishController);
router.put("/update-dish/:dishId", updateDishController);
router.delete("/delete-dish/:dishId", deleteDishController);

router.post("/add-offer", validate(OfferSchema), addOfferController);
router.delete("/delete-offer/:offerId", deleteOfferController);

router.post("/add-courier", validate(CourierSchema), addCourierController);
router.put("/update-courier/:courierId", updateCourierController);
router.delete("/delete-courier/:courierId", deleteCourierController);

router.post(
  "/add-flashDeal",
  validate(FlashDealSchema),
  addFlashDealController,
);
router.delete("/delete-flashDeal/:flashDealId", deleteFlashDealController);

router.put("/update-order/:orderId", updateOrderController);

export default router;
