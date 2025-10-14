import { Request, Response } from "express";
import Poll from "../../models/poll";
import User from "../../models/user";
import Vote from "../../models/vote";
import Result from "../../models/result";

export const createPollController = async (req:Request, res:Response) => {
  try {
    const {
      title,
      sub_title,
      sections
    } = req.body;

    const { id } = req.user ?? {}
    const user = await User.findById(id).select('_id first_name last_name email')

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    
    const options = [];
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ message: "At least one section is required" });
    }
    for (const section of sections) {
      if (!section.title) {
        return res.status(400).json({ message: "Each section must have a title" });
      }
      if (!section.options || !Array.isArray(section.options) || section.options.length < 1) {
        return res.status(400).json({ message: "Each section must have at least one option" });
      }
      options.push(...section.options);
    }
    for (const option of options) {
      if (!option.title) {
        return res.status(400).json({ message: "Each option must have a title" });
      }
    }

    const poll = await Poll.create({
      title,
      sub_title,
      sections,
      user_id: user._id
    });

    await Result.create({
      pollId: poll._id,
    });

    return res.status(201).json({ message: "Poll created successfully", poll });
  } catch (error) {
    console.error("Error creating poll:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}



export const addPollVoteController = async (req:Request, res:Response) => {
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

    for (const optionId of ranking) {
      const optionExists = poll.sections.some(section =>
        section.options.some(option => option._id.toString() === optionId)
      );
      if (!optionExists && optionId !== "others") {
        return res.status(400).json({ message: `Invalid option ID in ranking: ${optionId}` });
      }
    }

    if (ranking.length < poll.sections.length && !ranking.includes("others")) {
      return res.status(400).json({ message: "Ranking must include all options" });
    }
    
    await Vote.create({
      pollId: poll._id,
      ranking,
      user: { _id: userId }
    });

    poll.voteCount += 1;
    await poll.save();
    return res.status(200).json({ message: "Vote added successfully" });
  } catch (error) {
    console.error("Error adding vote:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}