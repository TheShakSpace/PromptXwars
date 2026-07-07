/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import { config } from "../config";
import { ValidationError } from "../errors/customErrors";

// Ensure upload directory exists
const uploadPath = path.resolve(config.UPLOAD_DIR);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`File type ${file.mimetype} is not allowed. Supported types: ${config.ALLOWED_FILE_TYPES.join(", ")}`), false);
  }
};

export const uploadService = {
  uploader: multer({
    storage,
    fileFilter,
    limits: {
      fileSize: config.MAX_UPLOAD_SIZE_MB * 1024 * 1024, // in bytes
    }
  }),
  
  getUploadPath: () => uploadPath,
  
  deleteFile: (filename: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const filePath = path.join(uploadPath, filename);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }
};
