import { Request, Response } from "express";
import { sendVerificationEmail } from "../../config/nodemailer";
import User from "../../models/user";
import { generateToken, hashSecret } from "./helpers";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const registerController = async (req:Request, res:Response) => {
  try {
    const userData = req.body

    const requiredPayload = ["email", "password", "first_name", "last_name"];
    for (const field of requiredPayload) {
      if (!userData[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` })
      }
    }

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    const { password } = userData;
    const hashedPassword = await hashSecret(password);
    
    const otp = generateOTP();
    await sendVerificationEmail(userData.email, otp);

    const hashedOTP = await hashSecret(otp, "crypto");
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword,
      otp: hashedOTP,
      otp_expiry: otpExpiry,
      is_verified: false
    };
    const user = await User.create(userWithHashedPassword)

    const token = generateToken(user._id.toString());
    const userDataForResponse = userWithHashedPassword;
    delete userDataForResponse.password;
    delete userDataForResponse.otp;
    delete userDataForResponse.otp_expiry;

    res.status(201).json({
      message: "User created and OTP sent successfully",
      token,
      user: userDataForResponse
    })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}