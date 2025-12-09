import { Request, Response } from "express";
import { Poll, Result, Vote } from "../models";
import { calculateResultsService } from "../services/calculateResultService";
import { formatResponse } from "../../../helpers";

export const getCalculatedPollResultsController = async (req: Request, res: Response) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const results = await Result.findOne({ pollId: poll._id });
    if (!results) {
      return res.status(404).json({ message: "Poll results not found" });
    }

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching poll results" });
  }
}



export const getMostUpdatedPollResultsController = async (req: Request, res: Response) => {
  try {
    const { pollId } = req.params;
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const result = await Result.findOne({ pollId: poll._id });
    if (!result) {
      return res.status(404).json({ message: "Poll results not found" });
    }

    const votes = await Vote.find({ poll_id: poll._id });
    const voteCount = votes.length;
    if (voteCount === result.voteCountCalculated) {
      return formatResponse({
        res,
        type: "success",
        message: "Poll results are up to date",
        data: { results: result }
      })
    }
    if (votes.length === 0) {
      return formatResponse({
        res,
        type: "success",
        message: "No votes found for this poll",
        data: { results: result }
      })
    }

    const formattedVotes = votes.map(vote => ({
      _id: vote._id.toString(),
      sections: vote.sections.map(section => ({
        sectionId: section.sectionId,
        ranking: section.ranking,
        groups: section.groups || {}
      }))
    }));
    const calculatedResults = calculateResultsService(formattedVotes);

    Result.findByIdAndUpdate(result._id, {
      $set: {
        voteCountCalculated: voteCount,
        sections: calculatedResults.sections
      }
    }, { new: true }).exec();

    const resultUpdated = await Result.findById(result._id);
    return formatResponse({
      res,
      type: "success",
      message: "Poll results updated successfully",
      data: { results: resultUpdated }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching poll results" });
  }
}