import { pick } from "lodash";

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

export interface loginUser extends Pick<User, "username" | "password"> {}
