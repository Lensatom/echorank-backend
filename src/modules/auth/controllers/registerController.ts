import { Request, Response } from "express";
import { formatResponse } from "../../../helpers";
import { User } from "../../users/models";
import { generateAndSendOtp } from "../services/otpService";
import { hashPassword } from "../services/passwordService";
import { generateTokens } from "../services/tokenService";

export const registerController = async (req:Request, res:Response) => {
  try {
    const userData = req.body
    const requiredPayload = ["email", "password", "first_name", "last_name"];

    for (const field of requiredPayload) {
      if (!userData[field]) return (
        formatResponse({
          res,
          type: "clientError",
          message: `Missing required field: ${field}`
        })
      );
    }

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) return (
      formatResponse({
        res,
        type: "clientError",
        message: "User with this email already exists"
      })
    );

    const { password } = userData;
    const hashedPassword = await hashPassword(password);
    
    const { otp, hashedOTP, otpExpiry } = await generateAndSendOtp(userData.email);

    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword,
      otp: hashedOTP,
      otp_expiry: otpExpiry,
      is_verified: false
    };

    const user = await User.create(userWithHashedPassword)

    const token = generateTokens(user._id.toString());

    const userDataForResponse = userWithHashedPassword;
    delete userDataForResponse.password;
    delete userDataForResponse.otp;
    delete userDataForResponse.otp_expiry;

    formatResponse({
      res,
      type: "created",
      message: "User created and OTP sent successfully",
      data: { token, user: userDataForResponse }
    })
  } catch (error) {
    formatResponse({
      res,
      type: "serverError",
      message: "Internal server error"
    });
  }
}