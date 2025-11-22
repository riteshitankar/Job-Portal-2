// import jwt from "jsonwebtoken"
// import dotenv from "dotenv"
// import { userModel } from "../models/userSchema.js"

// dotenv.config({ path: "./config.env" })

// const AuthUser = async (req, res, next) => {
//     try {

//         let userToken = req.headers.authorization

//         if (!userToken) throw ("token not found/invalid token !")

//         // verify

//         let result = jwt.verify(userToken, process.env.JWT_SECRET_KEY)

//         let user = await userModel.findOne({ "email.userEmail": result.email })

//         if (!user) throw ("user not found !")

//         if (!user.email.verified) throw ('email not verified please verify the email first to perform this action !')

//         req.user = user

//         next()

//     } catch (err) {
//         console.log("auth failed with an error : ", err)
//         res.status(401).json({ message: "auth user failed please login !" })
//     }
// }

// export { AuthUser }













// server/middlewares/AuthUser.js
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