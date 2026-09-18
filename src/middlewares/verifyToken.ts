import { NextFunction, Request, Response } from "express";
import { formatResponse } from "../helpers";
import { verifyAuthToken } from "../modules/auth/services/tokenService";
import { UserPayload } from "../types/express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token received in middleware:", token); // Debug log to check the token value
  if (!token) return formatResponse({ res, type: "unauthorized" });

  const decoded = verifyAuthToken(token) as UserPayload;
  if (!decoded) return formatResponse({ res, type: "unauthorized" });
  if (!decoded.id) return formatResponse({ res, type: "unauthorized" });

  req.user = decoded;
  next();
};
