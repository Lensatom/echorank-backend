import { Router } from "express";
import {
  addPollVoteController,
  createPollController,
  deletePollController,
  getPollByIdController,
  getUserPollsController,
  getCalculatedPollResultsController,
  getMostUpdatedPollResultsController
} from "../controllers";

const pollsRouter = Router();

pollsRouter.post("/", createPollController);
pollsRouter.get("/", getUserPollsController);
pollsRouter.get("/:pollId", getPollByIdController);
pollsRouter.delete("/:pollId", deletePollController);
pollsRouter.post("/:pollId/vote", addPollVoteController);
pollsRouter.get("/:pollId/results", getCalculatedPollResultsController);
pollsRouter.get("/:pollId/results/updated", getMostUpdatedPollResultsController);

export default pollsRouter;