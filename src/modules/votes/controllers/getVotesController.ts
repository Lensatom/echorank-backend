import { Request, Response } from "express";
import { Vote } from "../../polls/models";

export async function getVotesController(req: Request, res: Response) {
  try {
    const { pollId } = req.params;
    const votes = await Vote.find({ poll_id: pollId }).populate("user_id", "_id first_name last_name email");
    return res.status(200).json({ votes });
  } catch (error) {
    console.error("Error fetching votes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}