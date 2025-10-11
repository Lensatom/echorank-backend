import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { env } from "../config/env"
import { UserPayload } from "../types/express"

const {
  JWT_SECRET
} = env

export const verifyToken = (req:Request, res:Response, next:NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const decoded = jwt.verify(token, JWT_SECRET) as UserPayload
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (!decoded.id) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  req.user = decoded
  next()
}