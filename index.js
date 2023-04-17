const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();
const cookieParser=require("cookie-parser")
const bodyParser=require("body-parser")
const routes = require("./routes");
require("./config/database").connect();

const app = express();
app.use(cookieParser());
// Configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL
    ],
    credentials: true,
  })
);

app.use("/api", routes);

app.use(express.static("client/build"));

app.use((req, res) => {
  res.sendFile(`${__dirname}/client/build/index.html`);
});

app.listen(process.env.PORT || 5000, () => {
  console.log(process.env.PORT);
});
