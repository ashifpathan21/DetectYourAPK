import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

// Create a temporary directory outside your project
const uploadDir = path.join(os.tmpdir(), "apk_uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage });
