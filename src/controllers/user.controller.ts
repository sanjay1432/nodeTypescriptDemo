import { User, loginUser } from "../interfaces/user";
import { UserService } from "../services/user.service";
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

  @Get("/{userId}")
  public async getUser(@Path() userId): Promise<User> {
    return this.userService.getOne(userId);
  }

  @Security("bearer")
  @Get("/users/all")
  public async fetchAll(): Promise<User> {
    return this.userService.fetch();
  }

  @Post("/register")
  async createUser(@Body() req: User): Promise<User> {
    return this.userService.create(req);
  }

  @Post("/login")
  async login(@Body() req: loginUser): Promise<any> {
    return this.userService.authenticate(req);
  }
  @Put("/{userId}")
  async updateUser(@Path() userId, @Body() req: User): Promise<User> {
    return this.userService.update(userId, req);
  }

  @Delete("/{userId}")
  async deleteUser(@Path() userId): Promise<any> {
    return this.userService.delete(userId);
  }
}
