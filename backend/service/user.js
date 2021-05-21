import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../database/model/user.js";

export const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user;
};

export const loginUser = async (userData) => {
  const user = await getUser({ email: userData.email });
  if (!user) throw new Error("User does not exist");

  const hashedPassword = user.password;
  const passwordIsVerified = await verifyPassword(
    hashedPassword,
    userData.password
  );
  if (!passwordIsVerified) throw new Error("Password incorrect");

  const token = await generateToken(user);
  return token;
};

export const getUserByToken = async (token) => {
  const decoded = verifyToken(token); // throw an error if not valid
  const user = await getUser({ _id: decoded._id, "tokens.token": token });
  return user;
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const logoutUser = async (user, token) => {
  return await user.removeToken(token);
};

export const updateUser = async (user, updates) => {
  const updateFields = Object.keys(updates);
  const allowedUpdateFields = ["name", "password"];
  const isValidOperation = updateFields.every((field) =>
    allowedUpdateFields.includes(field)
  );

  if (!isValidOperation) {
    throw new Error("Invalid update");
  }

  updateFields.forEach((field) => (user[field] = updates[field]));
  await user.save();
  return user;
};

const getUser = async (criteria) => {
  const user = await User.findOne(criteria);
  return user;
};

const verifyPassword = async (hashedPassword, password) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = async (user) => {
  const token = await user.generateAuthToken();
  return token;
};
