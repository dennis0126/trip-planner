import express from "express";
import {
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../service/event.js";
import auth from "../middleware/auth.js";

const router = new express.Router();

// get an event
router.get("/:id", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.id;
    const event = await getEvent(userId, eventId);

    if (!event) {
      return res
        .status(404)
        .send({ message: "Failed to get event", error: "Trip does not exist" });
    }

    return res.send({
      event,
    });
  } catch (e) {
    res.status(500).send({
      message: "Failed to get event",
      error: e,
    });
  }
});

// create a event
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const eventData = req.body;
    const event = await createEvent(userId, eventData);
    res.status(201).send({
      message: "Create event successfully",
      event,
    });
  } catch (e) {
    res.status(400).send({
      message: "Failed to create event",
      error: e,
    });
  }
});

// edit a event
router.patch("/:id", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.id;
    const updates = req.body;
    const event = await getEvent(userId, eventId);
    if (!event) {
      return res.status(404).send({
        message: "Failed to update event",
        error: "Event does not exist",
      });
    }

    const newEvent = await updateEvent(event, updates);
    res.send({
      message: "Update event successfully",
      event: newEvent,
    });
  } catch (e) {
    res.status(400).send({
      message: "Failed to update event",
      error: e,
    });
  }
});

// delete a event
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.id;
    const event = await getEvent(userId, eventId);
    if (!event) {
      return res.status(404).send({
        message: "Failed to update event",
        error: "Event does not exist",
      });
    }

    await deleteEvent(event);
    res.send({
      message: "Delete event successfully",
    });
  } catch (e) {
    res.status(400).send({
      message: "Failed to get events",
      error: e,
    });
  }
});

export default router;
