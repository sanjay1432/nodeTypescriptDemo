import jwt from "jsonwebtoken";
import ENV from "../utils/env";
import { UserModel } from "../models/user.model";

export enum SecurityName {
  BEARER = "bearer",
  ADMIN = "admin"
}

export const signToken = info => {
  return jwt.sign(info, ENV.JWT_SECRET, { algorithm: "HS256", expiresIn: "60s" });
};
export async function expressAuthentication(request, securityName, _scopes): Promise<any> {
  switch (securityName) {
    case SecurityName.BEARER: {
      const bearertoken = request.header("Authorization")?.replace("Bearer ", "");
      if (!bearertoken) throw Error("No Token Provided");
      const data = validateToken(bearertoken);
      if (!data) throw Error("Token is not valid");
      const { _id } = data;
      const user = await UserModel.findById(_id);
      if (!user) throw Error("No user for provided token");
      return user;
    }
    case SecurityName.ADMIN:
      break;
  }
}

export function validateToken(token: string) {
  const tokenInfo = jwt.verify(token, ENV.JWT_SECRET) as TokenContent;
  return tokenInfo;
}

export interface TokenContent {
  _id: string;
}
