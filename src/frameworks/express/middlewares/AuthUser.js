import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UsersRepository from "../../../repositories/implementations/UsersRepository.js";

dotenv.config();

export const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Token not found, authentication failed" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error(err);
      return res.status(403).json({ msg: "Token invalid" });
    }

    try {
      const user = await UsersRepository.findByUserId(decodedToken.userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (user.status === "inactive" || "pending_verification") {
        return res.status(403).json({ msg: "User account is inactive" });
      }

      req.userId = user.id;
      req.role = user.role;
      req.email = user.email;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error" });
    }
  });
};

export const adminOnly = async (req, res, next) => {
  try {
    if (!req.userId || !req.role) {
      return res.status(401).json({ msg: "Token invalid" });
    }

    if (req.role !== "admin") {
      return res.status(403).json({ msg: "Forbidden access" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "Token invalid" });
  }
};
