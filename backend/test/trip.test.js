import request from "supertest";
import "regenerator-runtime/runtime";
import {
  userOneId,
  userOne,
  userTwo,
  tripOne,
  tripTwo,
  setupDatabase,
} from "./fixtures/db.js";
import Trip from "../database/model/trip.js";
import app from "../app.js";

beforeEach(setupDatabase);

const tripRoutePath = "/api/v1/trip";

// get all trips

test("Should get all trips belonging to the user", async () => {
  const response = await request(app)
    .get(`${tripRoutePath}/getAllTrips`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.trips.length).toBe(1);
});

// create trip

test("Should create a new Trip", async () => {
  const tripInfo = {
    name: "Bangkok202109",
    startDate: new Date("2021-09-06"),
    endDate: new Date("2021-09-11"),
  };

  const response = await request(app)
    .post(`${tripRoutePath}/createTrip`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(tripInfo)
    .expect(201);

  // Assert that the database was changed correctly
  const trip = await Trip.findById(response.body.trip._id);
  expect(trip).not.toBeNull();
  expect(trip).toMatchObject(tripInfo);
  expect(trip.creator).toEqual(userOneId);
  expect(trip.owners).toContainEqual(userOneId);

  // Assertions about the response
  tripInfo.startDate = tripInfo.startDate.toISOString();
  tripInfo.endDate = tripInfo.endDate.toISOString();
  expect(response.body).toMatchObject({
    trip: tripInfo,
  });
});

test("Should not create a new trip if end date is before start date", async () => {
  const tripInfo = {
    name: "Bangkok202109",
    startDate: new Date("2021-09-06"),
    endDate: new Date("2021-07-11"),
  };

  const response = await request(app)
    .post(`${tripRoutePath}/createTrip`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(tripInfo)
    .expect(400);
});

// get a trip

test("Should get a trip by id", async () => {
  await request(app)
    .get(`${tripRoutePath}/${tripOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get a trip if user is not the owner", async () => {
  await request(app)
    .get(`${tripRoutePath}/${tripOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(400);
});

test("Should not get a trip is the trip is deleted", async () => {
  await request(app)
    .get(`${tripRoutePath}/${tripTwo._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(400);
});

// update a trip

test("Should update a trip", async () => {
  const update = {
    name: "Tokyo2021 update",
    startDate: new Date("2021-06-16"),
    endDate: new Date("2021-06-20"),
  };

  const response = await request(app)
    .patch(`${tripRoutePath}/${tripOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(update)
    .expect(200);

  const trip = await Trip.findOne({ _id: tripOne._id });
  expect(trip).toMatchObject(update);
});

test("Should not update a trip if provided invalid updates", async () => {
  const update = {
    name: "Tokyo2021 update",
    startDate: new Date("2021-06-16"),
    endDate: new Date("2021-06-20"),
    creator: "qwerty",
  };

  await request(app)
    .patch(`${tripRoutePath}/${tripOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(update)
    .expect(400);
});

test("Should not update a trip if end date is before start date", async () => {
  const update = {
    name: "Tokyo2021 update",
    startDate: new Date("2021-06-16"),
    endDate: new Date("2021-05-20"),
  };

  await request(app)
    .patch(`${tripRoutePath}/${tripOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(update)
    .expect(400);
});

// delete trip

test("Should delete a trip", async () => {
  await request(app)
    .delete(`${tripRoutePath}/${tripOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const trip = await Trip.findOne({ _id: tripOne._id });
  expect(trip.isDeleted).toBe(true);
});
