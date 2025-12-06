import { Request, Response } from "express";
import { Poll, Result, Vote } from "../models";
import { calculateResultsService } from "../services/calculateResultService";

export const getPollResultsController = async (req: Request, res: Response) => {
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

    const voteCount = poll.voteCount || 0;
    const resultVoteCount = result.voteCountCalculated || 0;
    const isResultStale = voteCount !== resultVoteCount;

    // if (!isResultStale) {
    //   return res.status(200).json({ message: "Result as at last vote", results: votes });
    // }

    const votes = await Vote.find({ poll_id: poll._id });
    if (votes.length === 0) {
      return res.status(200).json({ message: "No votes found for this poll.", results: votes });
    }

    console.log("Fetched Votes:", votes);

    const formattedVotes = votes.map(vote => ({
      _id: vote._id.toString(),
      sections: vote.sections.map(section => ({
        sectionId: section.sectionId,
        ranking: section.ranking,
        groups: section.groups || {}
      }))
    }));

    console.log(formattedVotes)

    const calculatedResults = calculateResultsService(formattedVotes);
    console.log("Calculated Results:", calculatedResults);

    return res.status(200).json({ results: votes });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching poll results" });
  }
}