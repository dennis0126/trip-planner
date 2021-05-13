import express from "express";
import path from "path";

const app = express();

const publicDirPath = path.join(__dirname, "../frontend/dist");
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// set public path
app.use(express.static(publicDirPath));

// api router
app.use("/api/v1", apiRouter);

// use get * for frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDirPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
