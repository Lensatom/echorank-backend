import { Router } from "express";
import {
  deleteUserByIdController,
  retrieveUserController
} from "../controllers/user";

const userRouter = Router()

userRouter.get("/", retrieveUserController)
userRouter.delete("/:userId", deleteUserByIdController)

export default userRouter