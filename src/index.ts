import express  from "express"
import { connectDB } from "./config/db";
import { env } from "./config/env";
import pollRouter from "./routes/poll";
import userRouter from "./routes/user";
import { verifyToken } from "./middlewares";
import cors from "cors";
import { corsOptions } from "./config/cors";
import authRouter from "./modules/auth/routes";

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
app.use("/user", userRouter)
app.use("/poll", pollRouter)

connectDB(MONGODB_URI)

const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});