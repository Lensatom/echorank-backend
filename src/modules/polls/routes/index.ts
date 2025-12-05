import { Router } from "express";
import { createPollController } from "../../../controllers/poll";

const pollsRouter = Router()

pollsRouter.post("/create", createPollController)

export default pollsRouter;