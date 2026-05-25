import bcrypt from "bcryptjs";
import config from "../../config";
import { pool } from "../../db";
import jwt from "jsonwebtoken";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  const user = userData.rows[0];

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtpayload, config.secret as string, {
    expiresIn: "1d",
  });

  delete user.password;

  return {
    token: accessToken,
    user,
  };
};

export const authService = {
  loginUserIntoDB,
};
