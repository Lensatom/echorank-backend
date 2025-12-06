import { Request, Response } from "express";
import { Poll, Vote } from "../models";

export const addPollVoteController = async (req: Request, res: Response) => {
  try {
    const { pollId } = req.params;
    const { ranking } = req.body;
    const { id: userId } = req.user ?? {};

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    if (!ranking || !Array.isArray(ranking) || ranking.length === 0) {
      return res.status(400).json({ message: "Ranking is required" });
    }

    // for (const optionId of ranking) {
    //   const optionExists = poll.sections.some(section =>
    //     section.options.some(option => option._id.toString() === optionId)
    //   );
    //   if (!optionExists && optionId !== "others") {
    //     return res.status(400).json({ message: `Invalid option ID in ranking: ${optionId}` });
    //   }
    // }

    if (ranking.length < poll.sections.length && !ranking.includes("others")) {
      return res.status(400).json({ message: "Ranking must include all options" });
    }
    
    await Vote.create({
      poll_id: poll._id,
      user_id: userId,
      sections: ranking,
    });
    
    poll.voteCount += 1;
    await poll.save();
    return res.status(200).json({ message: "Vote added successfully" });
  } catch (error) {
    console.error("Error adding vote:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}