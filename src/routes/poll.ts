import { createPollController, deletePollController, getAllPollsController, getPollByIdController, getUserPollsController } from "controllers/poll";
import { Router } from "express";

const pollRouter = Router();

pollRouter.post("/", createPollController);
pollRouter.get("/:pollId", getPollByIdController);
pollRouter.get("/", getUserPollsController);
pollRouter.get("/all", getAllPollsController);
pollRouter.delete("/:pollId", deletePollController);

export default pollRouter;