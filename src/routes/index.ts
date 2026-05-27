import { Router } from "express";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";
import registerRoutes from "./register.routes";
import loginRoutes from "./login.routes";
import logoutRouts from "./logout.routes";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/register", registerRoutes);
router.use("/login", loginRoutes);

export default router;
