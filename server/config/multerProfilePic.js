import multer from "multer";
    import { CloudinaryStorage } from   "multer-storage-cloudinary";
    import cloudinary from "../config/cloudinary.js";

    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "job_portal/profile_pictures",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ width: 500, height: 500,     crop: "limit" }],
      },
    });

    const profilePicUpload = multer({ storage }).single ("file");

    export default profilePicUpload;