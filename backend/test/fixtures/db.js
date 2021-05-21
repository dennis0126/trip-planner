import "../../config/setupEnv.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../../database/model/user.js";
import Trip from "../../database/model/trip.js";

export const userOneId = new mongoose.Types.ObjectId();
export const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mike@example.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.ACCESS_TOKEN_SECRET),
    },
  ],
};

export const userTwoId = new mongoose.Types.ObjectId();
export const userTwo = {
  _id: userTwoId,
  name: "Jess",
  email: "jess@example.com",
  password: "myhouse099@@",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.ACCESS_TOKEN_SECRET),
    },
  ],
};

export const tripOne = {
  _id: new mongoose.Types.ObjectId(),
  name: "Tokyo2021",
  startDate: new Date("2021-05-16"),
  endDate: new Date("2021-05-20"),
  isDeleted: false,
  creator: userOneId,
  owners: [userOneId],
};

export const tripTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: "Sydney 2022",
  startDate: new Date("2022-12-10"),
  endDate: new Date("2022-12-19"),
  isDeleted: true,
  creator: userOneId,
  owners: [userOneId, userTwoId],
};

export const tripThree = {
  _id: new mongoose.Types.ObjectId(),
  name: "London 2021-11",
  startDate: new Date("2021-11-13"),
  endDate: new Date("2021-11-19"),
  isDeleted: false,
  creator: userTwoId,
  owners: [userTwoId],
};

export const setupDatabase = async () => {
  await User.deleteMany();
  await Trip.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Trip(tripOne).save();
  await new Trip(tripTwo).save();
  await new Trip(tripThree).save();
};
