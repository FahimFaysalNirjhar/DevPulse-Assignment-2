import { Router } from "express";
import { issueController } from "./issue.controller";
import { USER_ROLE } from "../../types";
import auth from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issueController.createIssue,
);

export const issueRouter = router;
