const express = require("express");
const cors = require("cors");
const app = express();

// Body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB setup
const db = require("./app/models");

// Prefer Docker env var if present, otherwise fall back to db.url
const MONGO_URL = process.env.MONGO_URL || db.url;

db.mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Test application." });
});

// ⚠ make sure the filename matches – is it tutorial.routes or turorial.routes?
require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;

// IMPORTANT: bind to 0.0.0.0 so it’s reachable from outside container
app.listen(PORT, "0.0.0.0", () => {
  console.log('Server is running on port ${PORT}.');
});