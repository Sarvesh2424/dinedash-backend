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
  getCouriersController,
  getFlashDealsController,
  getOrdersController,
  getRestaurantController,
  raiseTicketController,
  updateCourierController,
  updateDishController,
  updateFlashDealController,
  updateOrderController,
  updateRestaurantController,
  updateTicketController,
  uploadImageController,
} from "../controllers/admin.controller";
import { validate } from "../middlewares/validate.middleware";
import { DishSchema } from "../schemas/dish.schema";
import { OfferSchema } from "../schemas/offer.schema";
import { CourierSchema } from "../schemas/courier.schema";
import { FlashDealSchema } from "../schemas/flashDeal.schema";
import { getDishesController } from "../controllers/dish.controller";
import { TicketSchema } from "../schemas/ticket.schema";
import { getOffersController } from "../controllers/offer.controller";
import { uploadMiddleware } from "../middlewares/upload.middlewear";

const router = Router();

router.get("/get-dishes", getDishesController);
router.post("/add-dish", validate(DishSchema), addDishController);
router.put("/update-dish/:dishId", updateDishController);
router.delete("/delete-dish/:dishId", deleteDishController);

router.get("/get-offers", getOffersController);
router.post("/add-offer", validate(OfferSchema), addOfferController);
router.delete("/delete-offer/:offerId", deleteOfferController);

router.get("/get-couriers", getCouriersController);
router.post("/add-courier", validate(CourierSchema), addCourierController);
router.put("/update-courier/:courierId", updateCourierController);
router.delete("/delete-courier/:courierId", deleteCourierController);

router.get("/get-flashDeals", getFlashDealsController);
router.post(
  "/add-flashDeal",
  validate(FlashDealSchema),
  addFlashDealController,
);
router.put(
  "/update-flashDeal",
  validate(FlashDealSchema),
  updateFlashDealController,
);
router.delete("/delete-flashDeal/:flashDealId", deleteFlashDealController);

router.get("/get-orders", getOrdersController);
router.put("/update-order/:orderId", updateOrderController);

router.post("/raise-ticket", validate(TicketSchema), raiseTicketController);
router.put("/update-ticket/:ticketId", updateTicketController);

router.get("/get-restaurant", getRestaurantController);
router.put("/update-restaurant/:restaurantId", updateRestaurantController);

router.post(
  "/upload-image",
  uploadMiddleware.single("image"),
  uploadImageController,
);

export default router;
