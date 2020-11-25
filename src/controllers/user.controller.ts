import { User, UpdateUser, loginUser, UserRequest } from "../interfaces/user";
import express from "express";
import { UserService } from "../services/user.service";
import { sendVerificationMail } from "../services/mail.service";
import { signToken, signEmailToken, validateEmailToken } from "../services/auth.service";
import {
  Controller,
  Route,
  Get,
  Post,
  Put,
  Delete,
  Tags,
  Body,
  Security,
  Hidden,
  Request,
  OperationId,
  Path,
  Query,
  Example
} from "tsoa";
import logger from "../utils/logger";
import { UserModel } from "../models/user.model";

interface email {
  email: string;
}
@Tags("User Module")
@Route("")
export class UserController extends Controller {
  public userService = new UserService();

  /**
   * Get single user api.
   *
   * Fetch single user information using usedId.
   *
   * @param info
   */
  @Security("bearer")
  @Get("/")
  public async getUser(@Request() req): Promise<User> {
    return req.user;
  }

  @Get("/search/{searchTerm}")
  public async search(@Path() searchTerm): Promise<any> {
    return this.userService.search(searchTerm);
  }

  @Post("/mail")
  public async mail(@Request() req, @Body() body: email): Promise<any> {
    const token = await signEmailToken(body);
    const fullUrl = req.protocol + "://" + req.get("host") + "/api/verificationLink/" + token;
    body["url"] = fullUrl;
    return sendVerificationMail(body);
  }
  @Security("bearer")
  @Get("/refreshToken")
  public async refreshToken(@Request() req: UserRequest): Promise<string> {
    const { _id } = req.user;
    const token = await signToken({ _id });
    return token;
  }
  @Security("bearer")
  @Get("/users/all")
  public async fetchAll(): Promise<User> {
    return this.userService.fetch();
  }

  @Post("/register")
  async createUser(@Request() req, @Body() body: User): Promise<User> {
    const registeredUser = await this.userService.create(body);
    const token = await signEmailToken({ email: registeredUser.email.id });
    const fullUrl = req.protocol + "://" + req.get("host") + "/api/verificationLink/" + token;
    let payload = {
      url: fullUrl,
      email: registeredUser.email.id
    };
    await sendVerificationMail(payload);
    return registeredUser;
  }

  @Post("/email/verify")
  async verifyEmail(@Request() req, @Body() body: Pick<User, "email">): Promise<any> {
    const token = await signEmailToken({ email: body.email.id });
    const fullUrl = req.protocol + "://" + req.get("host") + "/api/verificationLink/" + token;
    let payload = {
      url: fullUrl,
      email: body.email.id
    };

    return await sendVerificationMail(payload);
  }
  /**
   * Authentication user api.
   *
   * Id can consist any one of valid/registered email-Id or username or phone.
   *
   * @param info
   */

  @Post("/login")
  async login(@Body() req: loginUser): Promise<any> {
    return this.userService.authenticate(req);
  }
  @Put("/{userId}")
  async updateUser(@Path() userId, @Body() req: UpdateUser): Promise<UpdateUser> {
    return this.userService.update(userId, req, "");
  }

  @Delete("/{userId}")
  async deleteUser(@Path() userId): Promise<any> {
    return this.userService.delete(userId);
  }

  @Get("/verificationLink/{token}")
  public async verifyLink(@Path() token, @Request() request: express.Request): Promise<any> {
    const response = (<any>request).res as express.Response;
    response.contentType("text/html");
    const isValid: any = await validateEmailToken(token);
    if (isValid) {
      const { email } = isValid;
      try {
        const user = await UserModel.findOne({ "email.id": email });
        if (user) {
          await UserModel.updateOne(
            { _id: user._id },
            {
              "email.verified": true
            }
          );
          response
            .send(
              `<html><body><h1>Congratualtions!!! Your Account is activated ${email} &#128522;</h1> <a href= "http://localhost:3000/Login">Click here to login</a></body></html>`
            )
            .end();
          return null; // Found via #44
        } else {
          response
            .send(
              `<html><body><h1>Sorry!!! ${email} is not registered with us yet &#128532;</h1> <a href= "http://localhost:3000/Signup">No worries  you can create an account here &#128522;</a></body> </body></html>`
            )
            .end();
          return null; // Found via #44
        }
      } catch (err) {
        response.send(`<html><body><h1>Something wrong with your Account! &#128532;</h1> </body></html>`).end();
        return null; // Found via #44
      }
    } else {
      response.send("<html><body><h1>Oops!!! Token Is inavlid or got expired  &#128532;</h1></body></html>").end();
      return null; // Found via #44
    }
  }
}
