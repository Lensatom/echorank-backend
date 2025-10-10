import { Request, Response } from "express";
import { hashSecret } from "./helpers";
import User from "../../models/user";

export const verifyOTPController = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;
    const { id: userId } = req.user ?? {};
  
    const user = await User.findById(userId);
  
    console.log("user:", user);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }
  
    if (user.is_verified) {
      return res.status(400).json({ message: "User is already verified" });
    }
  
    if (!user.otp_expiry) {
      return res.status(400).json({ message: "No OTP to verify" });
    }
  
    if (user.otp_expiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
  
    const hashedOTP = await hashSecret(otp, "crypto");
    const isOtpValid = user.otp === hashedOTP;
  
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  
    user.is_verified = true;
    user.otp = undefined;
    user.otp_expiry = undefined;
    await user.save();
  
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}