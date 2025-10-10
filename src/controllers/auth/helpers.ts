import { env } from "../../config/env";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";

const {
  JWT_SECRET,
  JWT_EXPIRES_IN
} = env

export const hashSecret = async (secret: string, usingHashingLibrary: "bcrypt" | "crypto" = "bcrypt") => {
  if (usingHashingLibrary === "bcrypt") {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedSecret = await bcrypt.hash(secret, salt);
    return hashedSecret;
  } else if (usingHashingLibrary === "crypto") {
    const hashedSecret = crypto.createHash("sha256").update(secret).digest("hex");
    return hashedSecret;
  } else {
    throw new Error("Unsupported hashing algorithm");
  }
}

export const generateToken = (id:string) => {
  const payload = { id }
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  const token = jwt.sign(payload, JWT_SECRET!, options);
  return token;
}