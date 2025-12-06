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