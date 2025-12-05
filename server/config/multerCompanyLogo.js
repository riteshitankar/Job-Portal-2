import multer from "multer";
import path from "path";

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/company_logos/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "company_logo_" + uniqueSuffix + path.extname(file.originalname));
  }
});

const companyLogoUpload = multer({
  storage: logoStorage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, WEBP images allowed!"));
  }
}).single("file");

export default companyLogoUpload;
