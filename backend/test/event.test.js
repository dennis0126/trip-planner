import request from "supertest";
import "regenerator-runtime/runtime";
import {
  userOneId,
  userOne,
  userTwo,
  tripOne,
  tripTwo,
  eventOne,
  setupDatabase,
} from "./fixtures/db.js";
import Trip from "../database/model/trip.js";
import Event from "../database/model/event.js";
import app from "../app.js";

beforeEach(setupDatabase);

const eventRoutePath = "/api/v1/event";

// get event

test("Should get an event", async () => {
  const response = await request(app)
    .get(`${eventRoutePath}/${eventOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const expectedEventOne = { ...eventOne };
  delete expectedEventOne.owners;
  expectedEventOne.startDate = expectedEventOne.startDate.toISOString();
  expectedEventOne.endDate = expectedEventOne.endDate.toISOString();
  expectedEventOne._id = expectedEventOne._id.toString();
  expectedEventOne.creator = expectedEventOne.creator.toString();
  expectedEventOne.trip = expectedEventOne.trip.toString();
  expect(response.body.event).toMatchObject(expectedEventOne);
});

test("Should not get an event if it does not belong to user", async () => {
  await request(app)
    .get(`${eventRoutePath}/${eventOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
});

// create event

test("Should create an event", async () => {
  const eventData = {
    name: "Dinner",
    startDate: new Date("2021-05-17T19:30:00"),
    endDate: new Date("2021-05-17T21:30:00"),
    location: [
      {
        latitude: 35.6604621,
        longitude: 139.7205238,
      },
    ],
    type: "point",
    description: "Restaurant",
    trip: tripOne._id,
  };

  const response = await request(app)
    .post(`${eventRoutePath}/`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(eventData)
    .expect(201);

  // Assert that the database was changed correctly
  const event = (await Event.findById(response.body.event._id)).toObject();
  expect(event).not.toBeNull();
  expect(event).toMatchObject(eventData);
  expect(event.creator).toEqual(userOneId);
  expect(event.owners).toContainEqual(userOneId);
  expect(event.isDeleted).toBe(false);
});

test("Should not create event if the trip does not belong to user", async () => {
  const eventData = {
    name: "Dinner",
    startDate: new Date("2021-05-17T19:30:00"),
    endDate: new Date("2021-05-17T21:30:00"),
    location: [
      {
        latitude: 35.6604621,
        longitude: 139.7205238,
      },
    ],
    type: "point",
    description: "Restaurant",
    trip: tripOne._id,
  };

  await request(app)
    .post(`${eventRoutePath}/`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send(eventData)
    .expect(400);
});

// update event

test("Should update an event", async () => {
  const update = {
    name: "Tokyo Tower update",
    startDate: new Date("2021-05-16T15:15:00"),
    endDate: new Date("2021-05-16T15:45:00"),
    location: [
      {
        latitude: 35.6585804,
        longitude: 139.7454328,
      },
    ],
    description: "333 meters tall",
  };

  await request(app)
    .patch(`${eventRoutePath}/${eventOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(update)
    .expect(200);

  // Assert data is updated in db
  const event = (await Event.findOne({ _id: eventOne._id })).toObject();
  expect(event).toMatchObject(update);
});

test("Should not update event if provided invalid fields", async () => {
  let update = {
    name: "Tokyo Tower update",
    isDelete: true,
  };

  await request(app)
    .patch(`${eventRoutePath}/${eventOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(update)
    .expect(400);

  update = {
    name: "Tokyo Tower update",
    owners: [userOne._id, userTwo._id],
  };

  await request(app)
    .patch(`${eventRoutePath}/${eventOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send(update)
    .expect(400);
});

test("Should not update event if the event does not belong to user", async () => {
  const update = {
    name: "Tokyo Tower update",
    startDate: new Date("2021-05-16T15:15:00"),
    endDate: new Date("2021-05-16T15:45:00"),
    location: [
      {
        latitude: 35.6585804,
        longitude: 139.7454328,
      },
    ],
    description: "333 meters tall",
  };

  await request(app)
    .patch(`${eventRoutePath}/${eventOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send(update)
    .expect(404);
});

// delete trip

test("Should delete an event", async () => {
  await request(app)
    .delete(`${eventRoutePath}/${eventOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete an event if it does not belong to user", async () => {
  await request(app)
    .delete(`${eventRoutePath}/${eventOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
});
