import multer from "multer";
import path from "path";

const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/user_cover_photos/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "user_cover_" + uniqueSuffix + path.extname(file.originalname));
  },
});

const userCoverPicUpload = multer({
  storage: coverStorage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, WEBP images allowed"));
  },
}).single("file");

export default userCoverPicUpload;
