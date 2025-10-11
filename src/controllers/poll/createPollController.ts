import { Request, Response } from "express";

export const createPollController = (req:Request, res:Response) => {
  const {
    title,
    sub_title,
    sections
  } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return res.status(400).json({ message: "At least one section is required" });
  }

  return res.status(201).json({ message: "Poll created successfully" });
}