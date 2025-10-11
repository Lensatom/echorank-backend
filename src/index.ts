import express  from "express"
import { connectDB } from "./config/db";
import authRouter from "./routes/auth";
import { env } from "./config/env";
import userRouter from "routes/user";

const {
  PORT,
  MONGODB_URI
} = env;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRouter)
app.use("/user", userRouter)

connectDB(MONGODB_URI)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});