import express from "express";
import multer from "multer";
import { v4 } from "uuid";
import path, { extname } from "path";

const file = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./src/assets/uploads/");
  },

  filename: function(req: any, file: any, cb: any) {
    const extension = extname(file.originalname);
    cb(null, v4().replace(/-/g, "") + extension);
  }
});

let uploadFile = multer({ storage: file, limits: { fileSize: 1 * 1024 * 1024 } });

export class FileService {
  constructor() {}

  async handleFile(request: express.Request): Promise<any> {
    const multerSingle = uploadFile.single("file");

    return new Promise((resolve, reject) => {
      multerSingle(request, undefined, async error => {
        if (error) {
          reject(error);
        }
        const filename = request.file.filename;
        resolve(filename);
      });
    });
  }
}
