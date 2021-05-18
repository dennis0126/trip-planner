import request from "supertest";
import jwt from "jsonwebtoken";
import "regenerator-runtime/runtime";
// import {} from "../service/user";
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

// test("Should get user with credentials", () => {
//   expect();
// });

// test("Should verify password", () => {
//   expect();
// });

// test("Should generate token if credentials are verified", () => {
//   expect();
// });

// test("Should get user with token", () => {
//   expect();
// });

// test("Should remove token", () => {
//   expect();
// });

// test("Should update user info", () => {
//   expect();
// });

// test("Should update user password", () => {
//   expect();
// });
