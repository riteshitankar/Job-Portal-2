import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job_portal/resumes",
    resource_type: "raw", // IMPORTANT for PDF/DOC
    allowed_formats: ["pdf", "doc", "docx"],
  },
});

const uploadResume = multer({ storage }).single("resume");

export default uploadResume;
