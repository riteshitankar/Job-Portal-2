import jwt from "jsonwebtoken";
import { companyModel } from "../models/companySchema.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

export const AuthCompany = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.COMPANY_JWT_SECRET_KEY || process.env.JWT_SECRET_KEY);
    const company = await companyModel.findById(decoded.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    req.company = company;
    next();
  } catch (err) {
    console.log("Company token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
