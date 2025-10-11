import { Router } from "express";
import { createPollController, deletePollController, getPollByIdController, getUserPollsController } from "../controllers/poll";

const pollRouter = Router();

pollRouter.post("/", createPollController);
pollRouter.get("/", getUserPollsController);
pollRouter.get("/:pollId", getPollByIdController);
pollRouter.delete("/:pollId", deletePollController);

export default pollRouter;