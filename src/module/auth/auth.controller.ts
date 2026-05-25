import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  console.log("req.body:", req.body);
  console.log("req.headers:", req.headers);
  try {
    const result = await authService.loginUserIntoDB(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result.token,
      user: result.user,
    });
  } catch (error: any) {
    const statusCode = error.code;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const authController = {
  loginUser,
};
