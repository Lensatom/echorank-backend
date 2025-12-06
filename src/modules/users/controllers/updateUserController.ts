import { Request, Response } from "express"
import { User } from "../models"

export const updateUserController = async (req:Request, res:Response) => {
  try {
    const { id } = req.user ?? {}
    const user = await User.findById(id).select('-password -otp -otp_expiry')
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    
    const {
      first_name,
      last_name
    } = req.body
  
    user.first_name = first_name ?? user.first_name
    user.last_name = last_name ?? user.last_name
  
    await user.save()
    return res.status(200).json({ user })
  } catch (error) {
    console.error("Error updating user:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}



export const updateUserByIdController = async (req:Request, res:Response) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).select('-password -otp -otp_expiry')
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const {
      first_name,
      last_name
    } = req.body
  
    user.first_name = first_name ?? user.first_name
    user.last_name = last_name ?? user.last_name
  
    await user.save()
    return res.status(200).json({ user })
  } catch (error) {
    console.error("Error updating user:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
