import authRouter from "../../auth/routes";
import { getVotesController } from "../controllers/getVotesController";

const votesRouter = authRouter;

votesRouter.use("/", getVotesController);

export default votesRouter;