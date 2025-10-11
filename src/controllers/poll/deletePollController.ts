import { Request, Response } from "express"
import Poll from "models/poll"

export const deletePollController = async (req:Request, res:Response) => {
  try {
    const { pollId } = req.params
    const { id: userId } = req.user ?? {}
    const poll = await Poll.findById(pollId)
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" })
    }
    if (poll.user._id.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this poll" })
    }
    await Poll.findByIdAndDelete(pollId)
    return res.status(200).json({ message: "Poll deleted successfully" })
  } catch (error) {
    return res.status(500).json({ message: "Error deleting poll" })
  }
}