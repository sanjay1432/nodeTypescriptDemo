import { User, UpdateUser, loginUser, UserRequest } from "../interfaces/user";
import { UserService } from "../services/user.service";
import ENV from "../utils/env";
import logger from "../utils/logger";
export class Seed {
  public userService = new UserService();

  public async createUser() {
    const user = {
      email: {
        id: "admin@admin.com",
        verified: true
      },
      fullname: "admin",
      username: ENV.APP_ADMIN_UN,
      phone: {
        number: "+9863554564",
        verified: true
      },
      password: ENV.APP_ADMIN_PW,
      dob: "20/04/1991",
      location: {
        type: "Point",
        name: "Subang Jaya",
        coordinates: ["3.056733", "101.585121"]
      },
      professionalTitle: "Software Engineer",
      active: true,
      role: "admin"
    };
    try {
      await this.userService.create(user);
      logger.info("admin is created!");
      return;
    } catch (err) {
      return;
    }
  }
}
