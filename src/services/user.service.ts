import { UserModel } from "../models/user.model";
import { User, loginUser } from "../interfaces/user";
import { signToken } from "../services/auth.service";
import { ErrorResponse } from "../utils/error-helper";
import Mongoose from "mongoose";
export class UserService {
  constructor() {}
  async getOne(id): Promise<User> {
    const isValid = Mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new ErrorResponse(406, `${id} is not valid id!`);

    return UserModel.findById(id);
  }

  async create(user): Promise<User> {
    const res = await UserModel.create(user);
    return res;
  }
  async fetch(): Promise<any> {
    return UserModel.find();
  }
  async update(id, user): Promise<User> {
    const isValid = Mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new ErrorResponse(406, `${id} is not valid id!`);

    return UserModel.findOneAndUpdate({ _id: id }, user, { new: true });
  }

  async delete(id) {
    const isValid = Mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new ErrorResponse(406, `${id} is not valid id!`);

    return UserModel.deleteOne({ _id: id });
  }

  async authenticate(user: loginUser) {
    const { username, password } = user;

    //fetch user detail using username
    const existingUser = await UserModel.findOne({ username: username });
    if (!existingUser) throw new ErrorResponse(401, `${username} doesn't have account yet!`);

    // if user exist than compare the password
    const passwordMatched = await existingUser.schema.methods.comparePasswords(password, existingUser.password);

    if (!passwordMatched) throw new ErrorResponse(401, `Given password is not available for ${username}`);

    //generate token for valid user
    const token = await signToken({ _id: existingUser._id });
    return token;
  }
}
