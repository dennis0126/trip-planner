import express from "express";
import auth from "../middleware/auth.js";
import {
  getAllTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
  getEventsInTrip,
} from "../service/trip.js";

const router = new express.Router();

// list all trips
router.get("/getAllTrips", auth, async (req, res) => {
  try {
    const trips = await getAllTrips(req.user._id);
    res.send({
      trips,
    });
  } catch (e) {
    res.status(500).send({
      message: "Failed to get all trips",
      error: e,
    });
  }
});

// create a trip
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const tripData = req.body;
    const trip = await createTrip(userId, tripData);
    res.status(201).send({
      message: "Create trip successfully",
      trip,
    });
  } catch (e) {
    res.status(400).send({
      message: "Failed to create new trip",
      error: e,
    });
  }
});

// get a trip
router.get("/:id", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const tripId = req.params.id;
    const trip = await getTrip(userId, tripId);
    if (trip) {
      return res.send({
        trip,
      });
    } else {
      return res
        .status(404)
        .send({ message: "Failed to get trip", error: "Trip does not exist" });
    }
  } catch (e) {
    res.status(500).send({
      message: "Failed to get trip",
      error: e,
    });
  }
});

// edit a trip
router.patch("/:id", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const tripId = req.params.id;
    const updates = req.body;
    const trip = await getTrip(userId, tripId);
    if (!trip) {
      return res.status(404).send({
        message: "Failed to update trip",
        error: "Trip does not exist",
      });
    }

    const newTrip = await updateTrip(trip, updates);
    res.send({
      trip: newTrip,
    });
  } catch (e) {
    res.status(400).send({
      message: "Failed to update trip",
      error: e,
    });
  }
});

// delete a trip
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const tripId = req.params.id;
    const trip = await getTrip(userId, tripId);
    if (!trip) {
      return res.send(404).send({
        message: "Failed to update trip",
        error: "Trip does not exist",
      });
    }

    await deleteTrip(trip);
    res.send({
      message: "Delete trip successfully",
    });
  } catch (e) {
    res.status(500).send({
      message: "Failed to delete trip",
      error: e,
    });
  }
});

router.get("/:id/getEvents", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const tripId = req.params.id;
    const events = await getEventsInTrip(userId, req.params.id);
    res.send({ events });
  } catch (e) {
    res.status(400).send({
      message: "Failed to get events",
      error: e,
    });
  }
});

export default router;
