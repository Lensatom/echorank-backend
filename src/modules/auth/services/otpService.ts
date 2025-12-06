import { sendOtp } from "./emailService";

export const generateAndSendOtp = async (email:string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = "hashed_" + otp;
  const otpExpiry = Date.now() + 10 * 60 * 1000;
  
  sendOtp(email, otp);
  
  const otpData = { otp, hashedOTP, otpExpiry };
  return otpData;
}


export const verifyOtp = (inputOtp: string, storedHashedOtp: string) => {
  const hashedInputOtp = "hashed_" + inputOtp;
  return hashedInputOtp === storedHashedOtp;
}