import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    // res.status(201).json({
    //   success: true,
    //   message: "User registered successfully",
    //   data: result.rows[0],
    // });

    sendResponse(res, {
      statuscode: 201,
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    const status = error.statusCode ?? 500;
    // res.status(status).json({
    //   success: false,
    //   message: error.message,
    //   error: error,
    // });

    sendResponse(res, {
      statuscode: status,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
};
