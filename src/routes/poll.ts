import { Router } from "express";
import {
  addPollVoteController,
  createPollController,
  deletePollController,
  getPollByIdController,
  getPollResultsController,
  getUserPollsController
} from "../controllers/poll";

const pollRouter = Router();

pollRouter.post("/", createPollController);
pollRouter.get("/", getUserPollsController);
pollRouter.get("/:pollId", getPollByIdController);
pollRouter.delete("/:pollId", deletePollController);
pollRouter.post("/:pollId/vote", addPollVoteController);
pollRouter.get("/:pollId/results", getPollResultsController);

export default pollRouter;