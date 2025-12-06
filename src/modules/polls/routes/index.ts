import { Router } from "express";
import {
  addPollVoteController,
  createPollController,
  deletePollController,
  getPollByIdController,
  getPollResultsController,
  getUserPollsController
} from "../controllers";

const pollsRouter = Router();

pollsRouter.post("/", createPollController);
pollsRouter.get("/", getUserPollsController);
pollsRouter.get("/:pollId", getPollByIdController);
pollsRouter.delete("/:pollId", deletePollController);
pollsRouter.post("/:pollId/vote", addPollVoteController);
pollsRouter.get("/:pollId/results", getPollResultsController);

export default pollsRouter;