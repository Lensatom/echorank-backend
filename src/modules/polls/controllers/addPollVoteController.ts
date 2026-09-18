import { Request, Response } from "express";
import { Poll, Vote } from "../models";

export const addPollVoteController = async (req: Request, res: Response) => {
  try {
    const { pollId } = req.params;
    const { id: userId } = req.user ?? {};
    
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const { sections } = req.body;
    if (!Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ message: "sections is required and must be a non-empty array" });
    }

    const pollSectionsById = new Map(
      poll.sections.map(section => [section.sectionId.toString(), section])
    );

    for (const section of sections) {
      if (!section.sectionId || !Array.isArray(section.ranking) || section.ranking.length === 0) {
        return res.status(400).json({ message: "Each section must include sectionId and a non-empty ranking array" });
      }

      const pollSection = pollSectionsById.get(section.sectionId.toString());
      if (!pollSection) {
        return res.status(400).json({ message: "Invalid sectionId in vote payload" });
      }

      const validOptions = new Set(pollSection.options.map(option => option.name));
      const seenOptions = new Set<string>();

      for (const option of section.ranking) {
        if (typeof option !== "string" || !validOptions.has(option)) {
          return res.status(400).json({ message: "Ranking contains an invalid option" });
        }

        if (seenOptions.has(option)) {
          return res.status(400).json({ message: "Ranking cannot contain duplicate options" });
        }

        seenOptions.add(option);
      }
    }

    await Vote.create({
      poll_id: poll._id,
      user_id: userId,
      sections,
    });

    return res.status(200).json({ message: "Vote added successfully" });
  } catch (error) {
    console.error("Error adding vote:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}