import multer from "multer";
import path from "path";

const profilePicStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profile_pictures/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "profile_" + uniqueSuffix + path.extname(file.originalname));
    }
});

const profilePicUpload = multer({
    storage: profilePicStorage,
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error("Only JPG, PNG, WEBP images allowed!"));
    }
}).single("file");

export default profilePicUpload;
