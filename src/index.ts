import cors from "cors";
import express from "express";
import { corsOptions } from "./config/cors";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { verifyToken } from "./middlewares";
import authRouter from "./modules/auth/routes";
import pollsRouter from "./modules/polls/routes";
import userRouter from "./modules/users/routes";

const {
  PORT,
  MONGODB_URI
} = env;

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, EchoRank servers are up and running!");
});

app.use("/auth", authRouter)

app.use(verifyToken)
app.use("/users", userRouter)
app.use("/polls", pollsRouter)

connectDB(MONGODB_URI)

const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});