import Event from "../database/model/event.js";
import { getTrip } from "./trip.js";

export const getEvent = async (userId, eventId) => {
  const event = await Event.findOne({
    _id: eventId,
    owners: userId,
    isDeleted: false,
  });
  return event;
};

export const createEvent = async (userId, eventData) => {
  const event = new Event(eventData);
  event.creator = userId;

  const trip = await getTrip(userId, eventData.trip);
  if (!trip) {
    throw new Error("Trip does not exist");
  }

  event.owners = trip.owners;
  await event.save();
  return event;
};

export const updateEvent = async (event, updates) => {
  const updateFields = Object.keys(updates);
  const allowedUpdateFields = [
    "name",
    "startDate",
    "endDate",
    "location",
    "type",
    "description",
  ];
  const isValidOperation = updateFields.every((field) =>
    allowedUpdateFields.includes(field)
  );

  if (!isValidOperation) {
    throw new Error("Invalid update");
  }

  updateFields.forEach((field) => (event[field] = updates[field]));
  await event.save();
  return event;
};

export const deleteEvent = async (event) => {
  event.isDeleted = true;
  await event.save();
};
