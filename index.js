const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");
require("./config/database").connect();

const app = express();

// Configure body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("YO");
});

app.use("/api", routes);

app.listen(process.env.PORT || 5000, () => {
  console.log(process.env.PORT);
});
