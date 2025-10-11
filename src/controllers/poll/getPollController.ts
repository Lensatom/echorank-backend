import { Request, Response } from "express";
import { paginationHelper } from "../../helpers";
import Poll from "../../models/poll";

export const getUserPollsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.user!;
    const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };

    const { data: polls, pagination } = await paginationHelper({
      Model: Poll,
      page,
      limit,
      query: { user: { _id: id } }
    })

    return res.status(200).json({
      polls,
      pagination
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching polls" });
  }
}



export const getPollByIdController = async (req: Request, res: Response) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    return res.status(200).json({ poll });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching poll" });
  }
}



export const getAllPollsController = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query as { page?: number; limit?: number };

    const { data: polls, pagination } = await paginationHelper({
      Model: Poll,
      page,
      limit
    })

    return res.status(200).json({
      polls,
      pagination
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching polls" });
  }
}