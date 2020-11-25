import { Request } from "express";
type Optional<T> = { [P in keyof T]?: T[P] };

interface Address {
  type: string;
  name: string;
  coordinates: string[];
}

interface Phone {
  number: string;
}

interface Email {
  id: string;
}
export interface User {
  /**
   * user valid email need to be provided
   */
  email: Email;
  fullname?: string;
  username: string;
  phone?: Phone;
  password: string;
  dob?: string;
  location?: Address;
  professionalTitle?: String;
}

// export interface loginUser extends Pick<User, "username" | "password"> {}
export interface loginUser {
  id: string;
  password: string;
}
export interface UserRequest extends Request {
  user?: User & { _id: string; picture?: string };
}
export type UpdateUser = Optional<User>;
