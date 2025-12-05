import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../../config/env";

const {
  JWT_SECRET,
  JWT_EXPIRES_IN
} = env

export const tokenGeneratorService = (id:string) => {
  const payload = { id }
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  const token = jwt.sign(payload, JWT_SECRET!, options);
  return token;
}