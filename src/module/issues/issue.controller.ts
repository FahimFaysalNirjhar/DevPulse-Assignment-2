import type { Request, Response } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  console.log(req.body);
  console.log("req.user", req.user);
  try {
    const reporter_id = req.user?.id;
    const result = await issueService.createIssueInToDB({
      ...req.body,
      reporter_id,
    });

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    const statusCode = error.statusCode ?? error.httpStatus ?? 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issueController = {
  createIssue,
};
