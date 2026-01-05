import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { redisClient } from "../utils/redisClient.js";
import { companyModel } from "../models/companySchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
dotenv.config({ path: "./config.env" });

// transporter (same as user)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.COMPANY_EMAIL || process.env.USER_EMAIL,
    pass: process.env.COMPANY_EMAIL_PASSWORD || process.env.USER_EMAIL_PASSWORD,
  },
});

function generateRandomNumber() {
  return Math.floor(Math.random() * 9000 + 1000).toString();
}

async function sendCompanyOTP(email) {
  try {
    let otp = generateRandomNumber();

    let emailOptions = {
      from: process.env.COMPANY_EMAIL || process.env.USER_EMAIL,
      to: email,
      subject: "Your OTP to verify company email | valid for 5 mins!",
      text: `Your OTP is ${otp}.`,
    };

    await transporter.sendMail(emailOptions);
    await redisClient.setEx(`companyEmail:${email}`, 300, otp);
    return { message: "otp sent successfully !", status: true };
  } catch (err) {
    console.log("error sending company otp : ", err);
    return { message: "unable to send otp !", status: false };
  }
}

async function sendCompanyOTPForPasswordReset(email) {
  try {
    let otp = generateRandomNumber();

    let emailOptions = {
      from: process.env.COMPANY_EMAIL || process.env.USER_EMAIL,
      to: email,
      subject: "Company Password Reset Request !",
      text: `Your OTP is ${otp} valid for 5 mins - use it to reset your password.`,
    };

    await transporter.sendMail(emailOptions);
    await redisClient.setEx(`companyEmailPasswordReset:${email}`, 300, otp);
    return { message: "otp sent successfully !", status: true };
  } catch (err) {
    console.log("error sending otp : ", err);
    return { message: "unable to send otp !", status: false };
  }
}

// simple test
const testCompany = (req, res) => {
  res.status(200).json({ message: "welcome to company test route !" });
};

const handleCompanyRegister = async (req, res) => {
  try {
    // expecting companyDetails.name, est_year, address fields, contact_person, email, phone, password, companyDetails.hrEmail, companyDetails.bio etc.
    let {
      companyDetails,
      contact_person,
      email,
      phone,
      password
    } = req.body;

    if (!companyDetails || !contact_person || !email || !phone || !password) {
      throw "invalid/missing data !";
    }

    // check if exists
    let checkIfCompanyExists = await companyModel.findOne({
      $or: [{ "email.userEmail": email }, { phone }],
    });

    if (checkIfCompanyExists) throw "unable to register company please change email/phone and try again !";

    // send otp
    let result = await sendCompanyOTP(email);
    if (!result.status) throw `unable to send otp at ${email} | ${result.message}`;

    let emailObject = { userEmail: email, verified: false };

    let newCompany = new companyModel({
      companyDetails,
      contact_person,
      email: emailObject,
      phone,
      password,
      // other fields will take defaults
    });

    await newCompany.save();

    res.status(202).json({
      message: `company registered successfully please verify the email using otp that is sent on email ${email}`,
    });
  } catch (err) {
    console.log("error while registering company : ", err);
    res.status(400).json({ message: "unable to register company !", err });
  }
};

const handleCompanyOTPVerification = async (req, res) => {
  try {
    let { email, companyOtp } = req.body;

    let companyExists = await companyModel.findOne({ "email.userEmail": email });
    if (!companyExists) throw `email ${email} is not registered !`;

    let storedOtp = await redisClient.get(`companyEmail:${email}`);
    if (!storedOtp) throw "otp is expired/not found !";
    if (storedOtp != companyOtp) throw "invalid otp !";

    await companyModel.updateOne({ "email.userEmail": email }, { $set: { "email.verified": true } });
    await redisClient.del(`companyEmail:${email}`);

    res.status(202).json({ message: "otp verified successfully please head to login !" });
  } catch (err) {
    console.log("error while verifying the otp : ", err);
    res.status(500).json({ message: "failed to verify company otp please try again later !", err });
  }
};

const handleCompanyLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    let companyExists = await companyModel.findOne({ "email.userEmail": email });
    if (!companyExists) throw "unable to find the email please register the company first !";

    if (!companyExists.email.verified) {
      let result = await sendCompanyOTP(email);
      if (!result.status) throw `unable to send otp at ${email} | ${result.message}`;
      throw `company email is not verified we have sent an otp at ${email} !`;
    }

    let result = await bcrypt.compare(password, companyExists.password);
    if (!result) throw "invalid email/password !";

    let token = jwt.sign({ id: companyExists._id }, process.env.COMPANY_JWT_SECRET_KEY || process.env.JWT_SECRET_KEY, { expiresIn: "24h" });

    res.status(202).json({ message: `welcome company ${companyExists.companyDetails.name} ! login was successful.`, token });
  } catch (err) {
    console.log("error while company login : ", err);
    res.status(400).json({ message: "unable to login", err });
  }
};

const handleCompanyResetPasswordRequest = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) throw "invalid/incomplete data !";

    let companyExists = await companyModel.findOne({ "email.userEmail": email });
    if (!companyExists) throw "invalid email address/Please register first !";

    let result = await sendCompanyOTPForPasswordReset(email);
    if (!result.status) throw `unable to send otp at ${email} | ${result.message}`;

    res.status(201).json({ message: `an otp sent to your email ${email} | valid for 5 mins to reset your password !` });
  } catch (err) {
    console.log("password reset request failed !", err);
    res.status(400).json({ message: "password reset request failed !", err });
  }
};

const handleCompanyOTPForPasswordReset = async (req, res) => {
  try {
    let { email, companyOtp, newPassword } = req.body;

    let companyExists = await companyModel.findOne({ "email.userEmail": email });
    if (!companyExists) throw `email ${email} is not registered !`;

    let storedOtp = await redisClient.get(`companyEmailPasswordReset:${email}`);
    if (!storedOtp) throw "otp is expired/not found !";
    if (storedOtp != companyOtp) throw "invalid otp !";

    let hash = await bcrypt.hash(newPassword, 10);
    await companyModel.updateOne({ "email.userEmail": email }, { $set: { password: hash } });
    await redisClient.del(`companyEmailPasswordReset:${email}`);

    res.status(202).json({ message: "otp verified successfully and password has been changed please head to login !" });
  } catch (err) {
    console.log("error while verifying the otp : ", err);
    res.status(500).json({ message: "failed to verify company otp please try again later !", err });
  }
};

const handleCompanyFileUpload = async (req, res) => {
  try {
    if (!req.file) throw new Error("Failed to upload a file!");

    const fileType = req.params.file_type;
    const fileUrl = req.file.path; // cloudinary URL

    let updateField = {};

    if (fileType === "company_logo") {
      updateField = { $set: { companyLogo: fileUrl } };
    } else if (fileType === "document") {
      updateField = { $push: { documents: fileUrl } };
    } else {
      throw new Error("Invalid file type");
    }

    await companyModel.updateOne(
      { _id: req.company._id },
      updateField
    );

    res.status(202).json({
      message: "Upload successful",
      fileUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", err });
  }
};


const uploadCompanyDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const docFilename = req.file.filename;

    const updatedCompany = await companyModel.findByIdAndUpdate(
      req.company._id,
      { $push: { documents: docFilename } },
      { new: true }
    );

    res.status(200).json({
      message: "Document uploaded successfully!",
      documents: updatedCompany.documents,
    });
  } catch (err) {
    res.status(500).json({ message: "Document upload failed", err });
  }
};

const deleteCompanyDocument = async (req, res) => {
  try {
    const company = await companyModel.findById(req.company._id);
    if (!company.documents || company.documents.length === 0) return res.status(400).json({ message: "No documents to delete" });

    // expecting req.body.filename to specify which to delete
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ message: "Please provide filename to delete" });

    const filePath = path.join(process.cwd(), "uploads", "company_documents", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    company.documents = company.documents.filter((d) => d !== filename);
    await company.save();

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete document", err });
  }
};

const fetchCompanyProfile = async (req, res) => {
  try {
    let company = req.company;
    let companyData = await companyModel.findOne({ "email.userEmail": company.email.userEmail });
    if (!companyData) throw "unable to load company profile !";
    res.status(200).json({ message: "got company profile data !", companyData });
  } catch (err) {
    console.log("unable to company profile : ", err);
    res.status(401).json({ message: "unable to send company profile data !", err });
  }
};

const updateCompanyBio = async (req, res) => {
  try {
    let { bio } = req.body;
    if (!bio || bio === "<p><br></p>" || bio.trim() === "" || bio.replace(/<[^>]*>/g, "").trim() === "") {
      return res.status(400).json({ message: "Bio cannot be empty!" });
    }

    const companyId = req.company._id;
    const updatedCompany = await companyModel.findByIdAndUpdate(companyId, { "companyDetails.bio": bio }, { new: true });

    return res.status(200).json({
      message: "Bio updated successfully!",
      bio: updatedCompany.companyDetails.bio
    });
  } catch (err) {
    console.log("Error updating company bio:", err);
    return res.status(400).json({ message: "Unable to update bio!" });
  }
};

export {
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
};
