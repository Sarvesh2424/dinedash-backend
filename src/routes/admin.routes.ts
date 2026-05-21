import { Router } from "express";
import {
  addDishController,
  deleteDishController,
  updateDishController,
} from "../controllers/admin.controller";

const router = Router();

router.post("/add-dish", addDishController);
router.put("/update-dish/:dishId", updateDishController);
router.delete("/delete-dish/:dishId", deleteDishController);

export default router;
