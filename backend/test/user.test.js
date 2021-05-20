import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import "regenerator-runtime/runtime";
import { userOneId, userOne, setupDatabase } from "./fixtures/db.js";
import User from "../database/model/user.js";
import app from "../app.js";

beforeEach(setupDatabase);

const userRoutePath = "/api/v1/user";

// sign up

test("Should sign up a new user", async () => {
  const response = await request(app)
    .post(`${userRoutePath}/signUp`)
    .send({
      name: "Dennis",
      email: "me@abc.com",
      password: "123456",
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Dennis",
      email: "me@abc.com",
    },
    token: user.tokens[0].token,
  });

  // Assert that the password is hashed in db
  expect(user.password).not.toBe("123456");
});

test("Should not create user if fields are missing", async () => {
  // name is missing
  await request(app)
    .post(`${userRoutePath}/signUp`)
    .send({
      email: "me@abc.com",
      password: "123456",
    })
    .expect(400);

  // email is missing
  await request(app)
    .post(`${userRoutePath}/signUp`)
    .send({
      name: "Dennis",
      password: "123456",
    })
    .expect(400);

  // password is missing
  await request(app)
    .post(`${userRoutePath}/signUp`)
    .send({
      name: "Dennis",
      email: "me@abc.com",
    })
    .expect(400);
});

test("Should not create user if email is used", async () => {
  await request(app)
    .post(`${userRoutePath}/signUp`)
    .send({
      name: "Dennis",
      email: userOne.email,
      password: "123456",
    })
    .expect(400);
});

// login

test("Should obtain token if successfully login", async () => {
  const response = await request(app)
    .post(`${userRoutePath}/login`)
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const decoded = jwt.verify(
    response.body.token,
    process.env.ACCESS_TOKEN_SECRET
  );
  expect(decoded._id).toEqual(userOneId.toString());
});

test("Should not login if provided incorrect credentials", async () => {
  await request(app)
    .post(`${userRoutePath}/login`)
    .send({
      email: userOne.email,
      password: "password",
    })
    .expect(400);
});

// logout
test("Should logout", async () => {
  await request(app)
    .post(`${userRoutePath}/logout`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // Assert the token is removed
  const user = await User.findById(userOneId);
  expect(user.tokens).not.toEqual(
    expect.objectContaining({
      _id: expect.any(mongoose.Schema.Types.ObjectId),
      token: userOne.tokens[0].token,
    })
  );
});

// profile

test("Should obtain user profile", async () => {
  const response = await request(app)
    .get(`${userRoutePath}/profile`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const userOneObj = { ...userOne };
  userOneObj._id = userOneObj._id.toString();
  delete userOneObj.password;
  delete userOneObj.tokens;

  expect(response.body).toMatchObject(userOneObj);
});

// update profile

test("Should update user profile", async () => {
  const response = await request(app)
    .patch(`${userRoutePath}/profile`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Michael",
      password: "abc1234",
    })
    .expect(200);

  // Assert user info is updated in database
  const user = await User.findOne({ _id: userOneId });
  expect(user.name).toBe("Michael");
  const isPasswordMatched = await bcrypt.compare("abc1234", user.password);
  expect(isPasswordMatched).toBe(true);
});

test("Should not update user profile if provided invalid field names", async () => {
  await request(app)
    .patch(`${userRoutePath}/profile`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Michael",
      password: "abc1234",
      extraField: 256,
    })
    .expect(400);
});
