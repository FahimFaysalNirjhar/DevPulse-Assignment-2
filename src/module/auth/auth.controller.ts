import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";

const loginUser = async (req: Request, res: Response) => {
  console.log("req.body:", req.body);
  console.log("req.headers:", req.headers);
  try {
    const result = await authService.loginUserIntoDB(req.body);

    // res.status(200).json({
    //   success: true,
    //   message: "Login successful",
    //   data: result,
    //   // user: result.user,
    // });

    sendResponse(res, {
      statuscode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode;
    // res.status(statusCode).json({
    //   success: false,
    //   message: error.message,
    // });

    sendResponse(res, {
      statuscode: statusCode,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const authController = {
  loginUser,
};
