// import multer from "multer"
// import path from "path"

// // Define storage logic
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const fileType = req.params.file_type // e.g. 'resume' or 'profile_pictures'

//         // Allow only 'resume' or 'profile_pictures' or 'company_logo'
//         if (fileType !== "resume" && fileType !== "profile_picture") {
//             return cb(new Error("Invalid upload type."))
//         }

//         // Define destination based on type
//         const uploadPath = path.join("uploads", fileType === "resume" ? "resumes" : "profile_pictures")

//         // uploads/profile_picture 

//         cb(null, uploadPath)
//     },

//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${file.originalname}`
//         cb(null, uniqueName)
//     },
// })

// const upload = multer({ storage })

// export { upload }




// server/config/multerConfig.js
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = req.params.file_type;
    if (!["resume", "profile_picture"].includes(fileType)) {
      return cb(new Error("Invalid file type"));
    }

    const uploadPath = path.join("uploads", fileType === "resume" ? "resumes" : "profile_pictures");

    // Create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"));
  }
});

export { upload };