import { Request, Response } from "express";
import { formatResponse } from "../../../helpers";
import { User } from "../../users/models";
import { Poll, Result } from "../models";

export const createPollController = async (req:Request, res:Response) => {
  try {
    const { id } = req.user!;
    const {
      title,
      description,
      sections
    } = req.body;    

    const missingPollField = ['title', 'sections', 'description'].find((f) => !req.body[f]);
    if (missingPollField) {
      return formatResponse({ res, type: "clientError", message: `${missingPollField} is required` });
    }

    if (!Array.isArray(sections) || sections.length === 0) {
      return formatResponse({ res, type: "clientError", message: "sections must be a non-empty array" });
    }

    for (const section of sections) {
      const missingSectionField = ['name', 'options'].find((f) => !section[f]);
      if (missingSectionField) {
        return formatResponse({ res, type: "clientError", message: `${missingSectionField} is required in each section` });
      }

      if (!Array.isArray(section.options) || section.options.length === 0) {
        return formatResponse({ res, type: "clientError", message: "options must be a non-empty array in each section" });
      }

      for (const option of section.options) {
        const missingOptionField = ['name'].find((f) => !option[f]);
        if (missingOptionField) {
          return formatResponse({ res, type: "clientError", message: `${missingOptionField} is required in each option` });
        }
      }
    }

    const user = await User.findById(id).select('_id')
    if (!user) {
      return formatResponse({ res, type: "clientError", message: "User does not exist" })
    }

    const poll = await Poll.create({
      title,
      description,
      sections,
      user_id: user._id,
      voteCount: 0
    });

    await Result.create({
      pollId: poll._id,
      voteCountCalculated: 0,
    });

    return formatResponse({
      res, type: "created",
      message: "Poll created successfully",
      data: { poll }
    });
  } catch (error) {
    console.error("Error creating poll:", error);
    return formatResponse({
      res,
      type: "serverError",
      message: "Internal server error",
      error
    });
  }
}