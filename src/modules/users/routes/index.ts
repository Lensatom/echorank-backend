import { Router } from "express";
import {
  deleteUserByIdController,
  retrieveUserController
} from "../controllers";

const usersRouter = Router()

usersRouter.get("/", retrieveUserController)
usersRouter.delete("/:userId", deleteUserByIdController)

export default usersRouter