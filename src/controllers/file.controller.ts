import { Get, Route, Security, Response, Post, Request, Tags } from "tsoa";
import { FileService } from "../services/file.service";
import express from "express";

@Tags("File Module")
@Route("files")
export class FilesController {
  public fileService = new FileService();

  @Post("uploadFile")
  public async uploadFile(@Request() request: express.Request): Promise<any> {
    const uploadedFile = await this.fileService.handleFile(request);
    // file will be in request.file, it is a buffer
    return uploadedFile;
  }
}
