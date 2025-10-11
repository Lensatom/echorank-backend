import { deleteUserController } from "controllers/user/deleteUserController";
import { getAllUsersController, getUserByIdController, retrieveUserController } from "controllers/user/getUserController";
import { Router } from "express";

const userRouter = Router()

userRouter.get("/user", retrieveUserController)
userRouter.get("/user/:userId", getUserByIdController)
userRouter.get("/users", getAllUsersController)
userRouter.delete("/user", deleteUserController)

export default userRouter