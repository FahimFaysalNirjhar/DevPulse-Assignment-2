import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import { truncates } from "bcryptjs";

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

const updateIssue = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = req.user as {
      id: number;
      role: string;
    };

    const result = await issueService.updateIssueInDB(
      req.body,
      id as string,
      user,
    );
    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
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

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const result = await issueService.deleteIssueFromDB(id as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        status: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
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
  updateIssue,
  deleteIssue,
};
