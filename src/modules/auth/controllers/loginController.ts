import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../../models/user";
import { tokenGeneratorService } from "../services/token.service";

export const loginController = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });

    const token = tokenGeneratorService(user._id.toString());
    
    const userDataForResponse = {
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    res.status(200).json({ message: "Login successful", token, user: userDataForResponse });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}