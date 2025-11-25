import jwt from "jsonwebtoken";
import { userModel } from "../models/userSchema.js";

export const AuthUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.id);  // Now using correct _id

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};