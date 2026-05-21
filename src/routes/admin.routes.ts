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
} from "../controllers/admin.controller";
import { validate } from "../middlewares/validate.middleware";
import { DishSchema } from "../schemas/dish.schema";
import { OfferSchema } from "../schemas/offer.schema";
import { CourierSchema } from "../schemas/courier.schema";
import { FlashDealSchema } from "../schemas/flashDeal.schema";

const router = Router();

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

export default router;
