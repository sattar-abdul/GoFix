import multer from "multer";

// Store in memory (for cloudinary upload)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;