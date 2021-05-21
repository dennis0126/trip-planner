import Trip from "../database/model/trip.js";

export const getAllTrips = async (userId) => {
  const trips = await Trip.find({ owners: userId, isDeleted: false });
  return trips;
};

export const createTrip = async (userId, tripInfo) => {
  const trip = new Trip(tripInfo);
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

export const updateTrip = async (userId, tripId, updates) => {
  const trip = await getTrip(userId, tripId);
  if (!trip) {
    throw new Error("Trip does not exist");
  }

  const updateFields = Object.keys(updates);
  const allowedUpdateFields = ["name", "startDate", "endDate"];
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

export const deleteTrip = async (userId, tripId) => {
  const trip = await getTrip(userId, tripId);

  if (!trip) {
    throw new Error("Trip does not exist");
  }

  trip.isDeleted = true;
  await trip.save();
};
