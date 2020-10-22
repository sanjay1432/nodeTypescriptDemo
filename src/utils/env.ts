import dotenv from "dotenv";
dotenv.config();
const { env } = process;
const NODE_ENV = (env.NODE_ENV || "local") as "local" | "sit" | "uat" | "production";
const ENV = Object.freeze({
  NODE_ENV,
  DB_USER: env.DB_USER,
  DB_PW: env.DB_PW,
  DB_HOST: env.DB_HOST,
  DB_PORT: parseInt(env.DB_PORT) ?? 5432,
  DB_DBNAME: env.DB_DBNAME,
  PORT: env.PORT,
  SALT_WORK_FACTOR: parseInt(env.SALT_WORK_FACTOR) ?? 10,
  JWT_SECRET: process.env.JWT_SECRET
});

export default ENV;
