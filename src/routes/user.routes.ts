import { Router } from "express";
import { placeOrderController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { OrderSchema } from "../schemas/order.schema";

const router = Router();

router.post("/place-order", validate(OrderSchema), placeOrderController);

export default router;
