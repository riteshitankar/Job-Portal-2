import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job_portal/user_cover_photos",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1200, height: 400, crop: "limit" }],
  },
});

const uploadUserCoverPhoto = multer({ storage }).single("file");

export default uploadUserCoverPhoto;
