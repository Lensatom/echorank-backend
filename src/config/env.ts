import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../../.env") })

const required = ["MONGODB_URI", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
}

type TimeString = `${number}${"s" | "m" | "h" | "d"}`;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as TimeString | undefined;

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  MONGODB_URI: process.env.MONGODB_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: JWT_EXPIRES_IN || "7d",
  EMAIL_SERVICE_USER: process.env.EMAIL_SERVICE_USER || "",
  EMAIL_SERVICE_PASSWORD: process.env.EMAIL_SERVICE_PASSWORD || ""
};