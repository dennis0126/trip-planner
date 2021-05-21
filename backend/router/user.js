import express from "express";
import _ from "lodash";
import auth from "../middleware/auth.js";
import {
  createUser,
  loginUser,
  logoutUser,
  updateUser,
} from "../service/user.js";

const router = new express.Router();

// sign up
router.post("/signUp", async (req, res) => {
  try {
    const userData = _.pick(req.body, ["name", "email", "password"]);

    const user = await createUser(userData);
    const token = await loginUser(userData);
    res.status(201).send({
      message: "Signed up successfully",
      token,
      user,
    });
  } catch (e) {
    res.status(400).send({
      message: "Failed to sign up",
      error: e,
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const userData = _.pick(req.body, ["email", "password"]);
    const token = await loginUser(userData);
    res.send({
      message: "Login successfully",
      token,
    });
  } catch (e) {
    res.status(400).send({
      message: "Failed to login",
      error: e,
    });
  }
});

// logout
router.post("/logout", auth, async (req, res) => {
  try {
    await logoutUser(req.user, req.token);
    res.send({
      message: "Logout successfully",
    });
  } catch (e) {
    res.status(500).send({
      message: "Failed to logout",
    });
  }
});

// profile
router.get("/profile", auth, (req, res) => {
  res.send({ user: req.user });
});

// update profile
router.patch("/profile", auth, async (req, res) => {
  try {
    const updatedUser = await updateUser(req.user, req.body);
    res.send({ user: updatedUser });
  } catch (e) {
    res.status(400).send(e);
  }
});

export default router;
