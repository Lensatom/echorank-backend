import { Request, Response } from "express"
import User from "../../models/user"

export const deleteUserByIdController = async (req:Request, res:Response) => {
  try {
    const { id } = req.user ?? {}
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    await User.findByIdAndDelete(id)
    return res.status(204).send()
  } catch (error) {
    console.error("Error deleting user:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
