import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";
import { userRouter } from "./module/User/user.route";

const app: Application = express();
const port = config.port;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/auth/signup", userRouter);

export default app;
