import { Router } from "express";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";
import registerRoutes from "./register.routes";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/register", registerRoutes);

export default router;
