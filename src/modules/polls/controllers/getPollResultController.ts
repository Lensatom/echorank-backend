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

    return res.status(200).json({ results: results.toObject() });
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

    const pollObject = poll.toObject();
    const resultObject = result.toObject();

    const voteCount = await Vote.countDocuments({ poll_id: poll._id });
    if (voteCount === result.voteCountCalculated) {
      return formatResponse({
        res,
        type: "success",
        message: "Poll results are up to date",
        data: { results: {
          ...resultObject,
          poll: pollObject,
          voteCount: voteCount
        }}
      })
    }
    if (voteCount === 0) {
      return formatResponse({
        res,
        type: "success",
        message: "No votes found for this poll",
        data: { results: result }
      })
    }
    
    const votes = await Vote.find({ poll_id: poll._id });
    const sectionIdArr = poll.sections.map(section => section.sectionId.toString());

    const resultsCalculated: Record<string, any>[] = [];
    for (let index = 0; index < sectionIdArr.length; index++) {
      const totalOptionCounts = poll.sections[index].options.length;
      const calculatedResults = calculateResultsService({
        votes,
        sectionId: sectionIdArr[index],
        totalOptionCounts
      });
      resultsCalculated.push({ [sectionIdArr[index]]: calculatedResults });
    }

    const updated = await Result.findByIdAndUpdate(
      result._id,
      {
        $set: {
          voteCountCalculated: voteCount,
          sections: resultsCalculated
        }
      },
      { new: true }
    ).exec();

    const updatedObject = updated?.toObject();

    if (!updatedObject) {
      return formatResponse({
        res,
        type: "serverError",
        message: "Poll results update failed"
      });
    }

    return formatResponse({
      res,
      type: "success",
      message: "Poll results updated successfully",
      data: {
        results: {
          poll: pollObject,
          ...updatedObject
        }
      }
    });
  } catch (error) {
    console.log("Error fetching most updated poll results:", error);
    return formatResponse({
      res,
      type: "serverError",
      message: "Error fetching most updated poll results",
      error
    });
  }
}