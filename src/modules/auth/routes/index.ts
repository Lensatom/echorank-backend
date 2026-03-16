import { Router } from "express";
import { loginController, meController, registerController } from "../controllers";
import { verifyToken } from "../../../middlewares";

const authRouter = Router()

authRouter.post("/login", loginController);
authRouter.post("/register", registerController);

authRouter.use(verifyToken);
authRouter.get("/me", meController);

export default authRouter;