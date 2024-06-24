import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import RefreshToken from "../models/RefreshTokenModel.js";

dotenv.config();

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

const revokeRefreshToken = async (refreshToken) => {
  await RefreshToken.destroy({ where: { token: refreshToken } });
}; 

export { generateAccessToken, generateRefreshToken, revokeRefreshToken };