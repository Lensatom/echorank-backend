import { sendVerificationEmail } from "../../../config/nodemailer";

export const sendOtp = async (email: string, otp: string) => {
  await sendVerificationEmail(email, otp);
}