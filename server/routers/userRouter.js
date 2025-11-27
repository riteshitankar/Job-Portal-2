import express from "express"
import { test, handleUserRegister, handleOTPVerification, handleUserLogin, updateUserBio, uploadResume, deleteResume, handleResetPasswordRequest, handleOTPForPasswordReset, handleUserFileUpload, fetchProfile  } from "../controllers/userController.js"
import { AuthUser } from "../middlewares/AuthUser.js"
import upload from "../config/multerConfig.js"
import profilePicUpload from "../config/multerProfilePic.js";


let userRouter = express.Router()

userRouter.get("/test", test)

userRouter.post("/register", handleUserRegister)

userRouter.post("/verify-otp", handleOTPVerification)

userRouter.post("/user-login", handleUserLogin)

userRouter.post("/password-reset-request", handleResetPasswordRequest)

userRouter.post("/verify-reset-password-request", handleOTPForPasswordReset)

// to upload resume/profie/docs we need to verfiy the user

// userRouter.post("/upload-file/:file_type", AuthUser, upload.single("file"), handleUserFileUpload)
// only profile_picture and resume

userRouter.get("/fetch-user-profile", AuthUser, fetchProfile)

userRouter.post(
    "/upload-file/:file_type",
    AuthUser,
    (req, res, next) => {
        if (req.params.file_type === "profile_picture") return profilePicUpload(req, res, next);
        if (req.params.file_type === "resume") return upload(req, res, next);

        return res.status(400).json({ message: "Invalid file type" });
    },
    handleUserFileUpload
);

userRouter.patch("/update-bio", AuthUser, updateUserBio);

userRouter.post("/upload-resume", AuthUser, upload, uploadResume);
userRouter.delete("/delete-resume", AuthUser, deleteResume);

export { userRouter }