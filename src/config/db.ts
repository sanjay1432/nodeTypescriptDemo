import Mongoose from "mongoose";
import ENV from "../utils/env";

const MONGO_URI = `mongodb+srv://${ENV.DB_USER}:${ENV.DB_PW}${ENV.DB_HOST}${ENV.DB_DBNAME}?retryWrites=true&w=majority`;

let database: Mongoose.Connection;

export const connect = async () => {
  if (database) {
    return;
  }
  try {
    await Mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("Connected to database");
    return;
  } catch (err) {
    console.log("Error connecting to database");
    return;
  }
};
