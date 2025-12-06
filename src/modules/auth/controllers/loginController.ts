import { Request, Response } from "express";
import { formatResponse } from "../../../helpers";
import { comparePassword } from "../services/passwordService";
import { generateTokens } from "../services/tokenService";
import { User } from "../../users/models";

export const loginController = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return (
      formatResponse({
        res,
        type: "clientError",
        message: "Email and password are required"
      })
    );

    const user = await User.findOne({ email });
    if (!user) return (
      formatResponse({
        res,
        type: "unauthorized",
        message: "Invalid email or password"
      })
    );

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return (
      formatResponse({
        res,
        type: "unauthorized",
        message: "Invalid email or password"
      })
    );

    const token = generateTokens(user._id.toString());
    
    const userDataForResponse = {
      _id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at,
      updated_at: user.updated_at
    }

    return (
      formatResponse({
        res,
        type: "success",
        message: "Login successful",
        data: { token, user: userDataForResponse },
      })
    );
  } catch (error) {
    formatResponse({
      res,
      type: "serverError",
      message: "Internal server error"
    });
  }
}