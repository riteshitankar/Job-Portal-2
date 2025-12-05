import express from "express";
import {
  testCompany,
  handleCompanyRegister,
  handleCompanyOTPVerification,
  handleCompanyLogin,
  fetchCompanyProfile,
  handleCompanyFileUpload,
  updateCompanyBio,
  handleCompanyResetPasswordRequest,
  handleCompanyOTPForPasswordReset,
  uploadCompanyDocument,
  deleteCompanyDocument
} from "../controllers/companyController.js";
import { AuthCompany } from "../middlewares/AuthCompany.js";
import companyLogoUpload from "../config/multerCompanyLogo.js";
import companyDocUpload from "../config/multerCompanyDoc.js";
import { jobModel } from "../models/jobSchema.js";
// import { AuthCompany } from "../middlewares/AuthCompany.js";


const companyRouter = express.Router();

companyRouter.get("/test", testCompany);

companyRouter.post("/register", handleCompanyRegister);
companyRouter.post("/verify-otp", handleCompanyOTPVerification);
companyRouter.post("/company-login", handleCompanyLogin);

companyRouter.post("/password-reset-request", handleCompanyResetPasswordRequest);
companyRouter.post("/verify-reset-password-request", handleCompanyOTPForPasswordReset);

companyRouter.get("/fetch-company-profile", AuthCompany, fetchCompanyProfile);

// file uploads: company_logo or document
companyRouter.post(
  "/upload-file/:file_type",
  AuthCompany,
  (req, res, next) => {
    if (req.params.file_type === "company_logo") return companyLogoUpload(req, res, next);
    if (req.params.file_type === "document") return companyDocUpload(req, res, next);
    return res.status(400).json({ message: "Invalid file type" });
  },
  handleCompanyFileUpload
);

companyRouter.post("/upload-document", AuthCompany, companyDocUpload, uploadCompanyDocument);
companyRouter.delete("/delete-document", AuthCompany, deleteCompanyDocument);

companyRouter.patch("/update-bio", AuthCompany, updateCompanyBio);




companyRouter.get("/my-jobs", AuthCompany, async (req, res) => {
  try {
    let company = req.company;

    let jobs = await jobModel.find({ jobCreatedBy: company._id })
      .sort({ timeStamp: -1 });

    res.status(200).json({ message: "company jobs", jobs });
  } catch (err) {
    res.status(500).json({ message: "unable to load jobs" });
  }
});




export { companyRouter };
