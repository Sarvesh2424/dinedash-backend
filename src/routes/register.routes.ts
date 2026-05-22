import { Router } from "express";
import { userRegisterController } from "../controllers/register.controller";
import { validate } from "../middlewares/validate.middleware";
import { UserSchema } from "../schemas/user.schema";

const router = Router();

router.post("/user-register", validate(UserSchema), userRegisterController);

export default router;
