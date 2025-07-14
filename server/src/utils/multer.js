import multer from "multer";

// Store file temporarily before uploading to Cloudinary
const storage = multer.memoryStorage(); // use memory if uploading to Cloudinary

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({ storage: multer.memoryStorage() });

export default upload;
