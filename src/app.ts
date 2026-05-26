import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";
import { userRouter } from "./module/User/user.route";
import { authRouter } from "./module/auth/auth.router";
import { issueRouter } from "./module/issues/issue.route";
import cors from "cors";
import globalErrorHandler from "./module/middleware/globalErrorHandler";

const app: Application = express();
const port = config.port;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5000",
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/auth/signup", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/issues", issueRouter);
app.use(globalErrorHandler);

export default app;
