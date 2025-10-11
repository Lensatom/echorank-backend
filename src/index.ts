import express  from "express"
import { connectDB } from "./config/db";
import authRouter from "./routes/auth";
import { env } from "./config/env";
import userRouter from "routes/user";
import pollRouter from "routes/poll";
import { verifyToken } from "middlewares";

const {
  PORT,
  MONGODB_URI
} = env;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, EchoRank servers are up and running!");
});

app.use("/auth", authRouter)

app.use(verifyToken)
app.use("/user", userRouter)
app.use("/poll", pollRouter)

connectDB(MONGODB_URI)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});