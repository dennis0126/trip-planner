import express from "express";
import auth from "../middleware/auth.js";
import {
  getAllTrips,
  createTrip,
  getTrip,
  updateTrip,
  deleteTrip,
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
router.post("/createTrip", auth, async (req, res) => {
  try {
    const trip = await createTrip(req.user._id, req.body);
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
    const trip = await getTrip(req.user._id, req.params.id);
    if (trip) {
      return res.send({
        trip,
      });
    } else {
      return res
        .status(400)
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
    const trip = await updateTrip(req.user._id, req.params.id, req.body);
    res.send({
      trip,
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
    await deleteTrip(req.user._id, req.params.id);
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

export default router;
