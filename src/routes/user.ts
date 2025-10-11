import { deleteUserController } from "controllers/user/deleteUserController";
import { getAllUsersController, getUserByIdController, retrieveUserController } from "controllers/user/getUserController";
import { Router } from "express";

const userRouter = Router()

userRouter.get("/", retrieveUserController)
userRouter.get("/:userId", getUserByIdController)
userRouter.get("/all", getAllUsersController)
userRouter.delete("/", deleteUserController)

export default userRouter