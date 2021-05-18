import mongoose from "mongoose";
import User from "./model/user.js";

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  // check connection
  // console.log("connected");
  // console.log(mongoose.connection.readyState); //logs 1
});
