import { Request, Response } from "express";
import { User } from "../models";
import { paginationHelper } from "../../../helpers";

export const retrieveUserController = async (req:Request, res:Response) => {
  const { id } = req.user ?? {}
  const user = await User.findById(id).select('-password -otp -otp_expiry')
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  return res.status(200).json({ user })
}



export const getUserByIdController = async (req:Request, res:Response) => {
  const { userId } = req.params
  const user = await User.findById(userId).select('-password -otp -otp_expiry')
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  return res.status(200).json({ user })
}



export const getAllUsersController = async (req:Request, res:Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { data: users, pagination } = await paginationHelper({
      Model: User,
      page,
      limit,
      selectFields: '-password -otp -otp_expiry'
    })

    return res.status(200).json({
      users,
      pagination
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users" });
  }
}