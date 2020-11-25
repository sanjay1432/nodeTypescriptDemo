import { UserService } from "../services/user.service";
import { User, loginUser } from "../interfaces/user";
import ENV from "../utils/env";

const MONGO_URI = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PW}${ENV.DB_HOST}${ENV.DB_DBNAME}?retryWrites=true&w=majority`;
const mongoose = require("mongoose");
const userService = new UserService();

const newUser: User = {
  email: "test@test.com",
  username: "test",
  phoneNumber: "03334445",
  password: "123456",
  dob: "20/04/1991"
};
let user;

describe("User Model Test", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useCreateIndex: true }, err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });
  afterAll(async () => {
    if (user._id) {
      await userService.delete(user._id);
    }
    mongoose.connection.close();
  });

  describe("User Register test", () => {
    test("should create the user", async () => {
      const res = await userService.create(newUser);
      user = res;
      expect(res.username).toEqual("test");
    });
  });
  describe("User auth test", () => {
    test("should return token on authentication", async () => {
      const user = {
        id: "test",
        password: "123456"
      };
      const token = await userService.authenticate(user);
      expect(token).toBeDefined();
    });

    test("should throw error for wrong username", async () => {
      const user = {
        id: "test1",
        password: "123456"
      };
      await expect(userService.authenticate(user)).rejects.toThrowError(`${user.id} doesn't have account yet!`);
    });

    test("should throw error for wrong password", async () => {
      const user = {
        id: "test",
        password: "12345"
      };
      await expect(userService.authenticate(user)).rejects.toThrowError(
        `Given password is not available for ${user.id}`
      );
    });
  });

  describe("User CRUD test", () => {
    test("should update the user phone number", async () => {
      const payload = {
        phoneNumber: "03334446"
      };
      const res = await userService.update(user._id, payload);
      expect(res.phoneNumber).toEqual("03334446");
    });

    test("should get the user from id", async () => {
      const res = await userService.getOne(user._id);
      expect(res.username).toEqual("test");
    });

    test("should throw error for invalid id", async () => {
      const res = userService.getOne(`${user._id}12`);
      await expect(res).rejects.toThrowError(`${user._id}12 is not valid id!`);
    });
    test("should delete the user", async () => {
      const res = await userService.delete(user._id);
      expect(res.deletedCount).toEqual(1);
    });
  });
});
