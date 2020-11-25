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
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY_TIME: process.env.JWT_EXPIRY_TIME,
  JWT_EMAIL_SECRET: process.env.JWT_EMAIL_SECRET,
  JWT_EMAIL_EXPIRY_TIME: process.env.JWT_EMAIL_EXPIRY_TIME,
  CORS_ORIGINS: env.CORS_ORIGINS?.split(",") ?? [],
  APP_ADMIN_UN: env.ADMIN_UN,
  APP_ADMIN_PW: env.ADMIN_PW,
  APP_MAIL_USER: env.MAIL_USER,
  APP_MAIL_PWD: env.MAIL_PWD
});

export default ENV;
