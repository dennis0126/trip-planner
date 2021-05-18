import dotenv from "dotenv";

// set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || "development";
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: "./config/.test.env" });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: "./config/.development.env" });
}
