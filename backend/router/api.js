import express from "express";
import userRouter from "./user.js";
import tripRouter from "./trip.js";
import eventRouter from "./event.js";

const router = new express.Router();

router.use("/user", userRouter);
router.use("/trip", tripRouter);
router.use("/event", eventRouter)

export default router;
