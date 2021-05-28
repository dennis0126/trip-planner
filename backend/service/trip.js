import Trip from "../database/model/trip.js";
import Event from "../database/model/event.js";

export const getAllTrips = async (userId) => {
  const trips = await Trip.find({ owners: userId, isDeleted: false });
  return trips;
};

export const createTrip = async (userId, tripData) => {
  const trip = new Trip(tripData);
  trip.creator = userId;
  trip.owners = [userId];
  await trip.save();
  return trip;
};

export const getTrip = async (userId, tripId) => {
  const trip = await Trip.findOne({
    _id: tripId,
    owners: userId,
    isDeleted: false,
  });
  return trip;
};

export const updateTrip = async (trip, updates) => {
  const updateFields = Object.keys(updates);
  const allowedUpdateFields = ["name", "startDate", "endDate", "owners"];
  const isValidOperation = updateFields.every((field) =>
    allowedUpdateFields.includes(field)
  );

  if (!isValidOperation) {
    throw new Error("Invalid update");
  }

  updateFields.forEach((field) => (trip[field] = updates[field]));
  await trip.save();
  return trip;
};

export const deleteTrip = async (trip) => {
  trip.isDeleted = true;
  await trip.save();
};

export const getEventsInTrip = async (userId, tripId) => {
  const trip = await Trip.findOne({
    _id: tripId,
    owners: userId,
    isDeleted: false,
  });
  if (!trip) {
    throw new Error("Trip not found");
  }
  const events = await Event.find({
    trip: tripId,
    owners: userId,
    isDeleted: false,
  });
  return events;
};
