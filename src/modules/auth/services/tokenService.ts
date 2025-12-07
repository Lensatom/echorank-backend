import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../../config/env";

const {
  JWT_SECRET,
  JWT_EXPIRES_IN
} = env

export const generateTokens = (id:string) => {
  const data = { id }
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  const token = jwt.sign(data, JWT_SECRET!, options);
  return token;
}

export const verifyAuthToken = (token:string) => {
  const decoded = jwt.verify(token, JWT_SECRET!) as { id: string };
  return decoded;
}