import { Request, Response } from "express";
import User from "models/user";

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
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    
    const users = await User.find()
      .select('-password -otp -otp_expiry')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        limit,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users" });
  }
}