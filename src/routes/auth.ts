import { Router } from "express"
import { loginController, registerController, verifyOTPController } from "../controllers/auth"
import { verifyToken } from "../middlewares/verifyToken"

const authRouter = Router()

authRouter.post("/login", loginController)
authRouter.post("/register", registerController)

authRouter.use(verifyToken)
authRouter.post("/verify-otp", verifyOTPController)

export default authRouter