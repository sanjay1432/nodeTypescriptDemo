import { UserModel } from "../models/user.model";
import { User, loginUser, UpdateUser } from "../interfaces/user";
import { signToken } from "../services/auth.service";
import { ErrorResponse } from "../utils/error-helper";
import { EsClient } from "../config/es";
import Mongoose from "mongoose";
export class UserService {
  public es = new EsClient();

  private indexName = "user-index";
  private docType = "user";
  constructor() {
    this.createEsIndex();
  }

  async createEsIndex() {
    const { body } = await this.es.indexExists(this.indexName);
    if (!body) await this.es.createIndex(this.indexName);
  }
  async getOne(id): Promise<User> {
    const isValid = Mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new ErrorResponse(406, `${id} is not valid id!`);

    return UserModel.findById(id);
  }

  async create(user): Promise<User> {
    try {
      const res = await UserModel.create(user);
      const resObj = res.toObject();
      const id = resObj._id;
      delete resObj.password && delete resObj._id;
      await this.es.createDocument(this.indexName, id, this.docType, resObj);
      await this.es.refresh(this.indexName);
      return res;
    } catch (err) {
      throw new ErrorResponse(409, `${err.message}`);
    }
  }
  async fetch(): Promise<any> {
    return UserModel.find();
  }
  async update(id, user, session): Promise<UpdateUser> {
    const isValid = Mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new ErrorResponse(406, `${id} is not valid id!`);

    const response = await UserModel.findOneAndUpdate({ _id: id }, user, { new: true }).session(session);
    const resObj = response.toObject();
    delete resObj.password && delete resObj._id;
    const payload = {
      doc: resObj
    };
    await this.es.updateDocument(this.indexName, id, this.docType, payload);
    await this.es.refresh(this.indexName);
    return response;
  }

  async search(term) {
    const payload = {
      query: {
        match: { username: term }
      }
    };
    const result = await this.es.search(this.indexName, this.docType, payload);
    return result;
  }
  async delete(id) {
    const isValid = Mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new ErrorResponse(406, `${id} is not valid id!`);
    const result = await UserModel.deleteOne({ _id: id });
    await this.es.deleteDocument(this.indexName, id, this.docType);
    return result;
  }

  async authenticate(user: loginUser) {
    const { id, password } = user;

    //fetch user detail using username
    const existingUser = await UserModel.findOne({
      $or: [{ username: id }, { "email.id": id }, { "phone.number": id }]
    });
    if (!existingUser) throw new ErrorResponse(401, `${id} doesn't have account yet!`);

    // if user exist than compare the password
    const passwordMatched = await existingUser.schema.methods.comparePasswords(password, existingUser.password);

    if (!passwordMatched) throw new ErrorResponse(401, `Given password is not available for ${id}`);

    //generate token for valid user
    const token = await signToken({ _id: existingUser._id });
    return token;
  }
}
