import { Get, Route, Security, Response, Post, Request, Tags } from "tsoa";
import { FileService } from "../services/file.service";
import express from "express";
import { UserService } from "../services/user.service";
import { UserRequest } from "../interfaces/user";
import Mongoose from "mongoose";
import fs from "fs";
import path from "path";
@Tags("File Module")
@Route("files")
export class FilesController {
  public fileService = new FileService();
  public userService = new UserService();
  @Security("bearer")
  @Post("uploadFile")
  public async uploadFile(@Request() request: UserRequest): Promise<any> {
    const session = await Mongoose.startSession();
    session.startTransaction();
    try {
      const uploadedFile = await this.fileService.handleFile(request);
      // file will be in request.file, it is a buffer
      const { user } = request;
      //Check if user already have picture available
      let filepath = path.join(__dirname, "../../src/assets/uploads/");
      filepath = filepath + user.picture;
      if (fs.existsSync(filepath)) {
        //file exists
        fs.unlinkSync(filepath);
      }
      //update the file in user schema
      await this.userService.update(user._id, { picture: uploadedFile }, session);
      // commit the changes if everything was successful
      await session.commitTransaction();
      return uploadedFile;
    } catch (error) {
      await session.abortTransaction();
      // logging the error
      console.error(error);
      return error;
    }
  }
}
