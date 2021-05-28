import "../../config/setupEnv.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../../database/model/user.js";
import Trip from "../../database/model/trip.js";
import Event from "../../database/model/event.js";

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

export const eventOne = {
  _id: new mongoose.Types.ObjectId(),
  name: "Tokyo Tower",
  startDate: new Date("2021-05-16T15:00:00"),
  endDate: new Date("2021-05-16T15:30:00"),
  location: [
    {
      latitude: 35.6585805,
      longitude: 139.7454329,
    },
  ],
  type: "point",
  description: "https://www.tokyotower.co.jp/",
  isDeleted: false,
  trip: tripOne._id,
  creator: userOne._id,
  owners: [userOne._id],
};

export const eventTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: "Art Museum",
  startDate: new Date("2021-05-16T16:00:00"),
  endDate: new Date("2021-05-16T16:30:00"),
  location: [
    {
      latitude: 35.6604621,
      longitude: 139.7205238,
    },
  ],
  type: "point",
  description: "https://www.mori.art.museum/",
  isDeleted: false,
  trip: tripOne._id,
  creator: userOne._id,
  owners: [userOne._id],
};

export const eventThree = {
  _id: new mongoose.Types.ObjectId(),
  name: "Museum",
  startDate: new Date("2021-05-16T12:00:00"),
  endDate: new Date("2021-05-16T13:00:00"),
  location: [
    {
      latitude: 35.6607531,
      longitude: 139.720292,
    },
  ],
  type: "point",
  description: "bufuryu",
  isDeleted: true,
  trip: tripOne._id,
  creator: userOne._id,
  owners: [userOne._id],
};

export const setupDatabase = async () => {
  await User.deleteMany();
  await Trip.deleteMany();
  await Event.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Trip(tripOne).save();
  await new Trip(tripTwo).save();
  await new Trip(tripThree).save();
  await new Event(eventOne).save();
  await new Event(eventTwo).save();
  await new Event(eventThree).save();
};
