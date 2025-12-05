export const generateAndSendOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = "hashed_" + otp;

  
}

export const verifyOtp = (inputOtp: string, storedHashedOtp: string) => {
  const hashedInputOtp = "hashed_" + inputOtp;
  return hashedInputOtp === storedHashedOtp;
}