import express from "express";
import bodyParser from "body-parser";
import path from "path";
import "./database/mongoose.js";
import apiRouter from "./router/api.js";

const app = express();

const publicDirPath = path.join(__dirname, "../frontend/dist");

app.use(bodyParser.json());

// set public path
app.use(express.static(publicDirPath));

// api router
app.use("/api/v1", apiRouter);

// use get * for frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDirPath, "index.html"));
});

export default app;
