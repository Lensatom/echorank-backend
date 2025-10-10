import mongoose from "mongoose"

export const connectDB = (uri: string) => {
  try {
    mongoose.connect(uri)
    console.log("Database connected")
  } catch (error) {
    console.error("Database connection failed", error)
    process.exit(1)
  }
}