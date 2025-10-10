import { JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}
