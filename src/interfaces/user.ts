import { Request } from "express";
export interface User {
  /**
   * user valid email need to be provided
   */
  email: string;
  username: string;
  phoneNumbers?: string;
  password: string;
  dob?: string;
}

// export interface loginUser extends Pick<User, "username" | "password"> {}
export interface loginUser {
  id: string;
  password: string;
}
export interface UserRequest extends Request {
  user?: User & { _id: string };
}
