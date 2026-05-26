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

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDB(req.query);

    res.status(200).json({
      success: true,
      message: "Issues retrieved successfully",
      data: result,
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

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await issueService.getSingleIssueFromDB(id as string);
    res.status(200).json({
      success: true,
      message: "Issue retrieved successfully",
      data: result,
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
  getAllIssues,
  getSingleIssue,
};
