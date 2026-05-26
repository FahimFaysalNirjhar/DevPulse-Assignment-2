import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../../types";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";
import sendResponse from "../../utility/sendResponse";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        // return res.status(401).json({
        //   success: false,
        //   message: "Unauthorized access!!!",
        // });

        return sendResponse(res, {
          statuscode: 401,
          success: false,
          message: "Unauthorized access!!!",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;

      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [decoded.email],
      );

      if (userData.rows.length === 0) {
        // return res.status(404).json({
        //   success: false,
        //   massage: "User Not Found!!!",
        // });

        return sendResponse(res, {
          statuscode: 404,
          success: false,
          message: "User Not Found!!!",
        });
      }

      const user = userData.rows[0];

      if (roles.length && !roles.includes(user.role)) {
        // return res.status(403).json({
        //   success: false,
        //   massage:
        //     "Access denied. You are not authorized to perform this action.",
        // });

        return sendResponse(res, {
          statuscode: 403,
          success: false,
          message:
            "Access denied. You are not authorized to perform this action.",
        });
      }

      req.user = decoded;
      console.log(req.user);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
