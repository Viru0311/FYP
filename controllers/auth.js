const bcrypt = require("bcrypt");
const config = require("../config/config.server");
const db = require("../models");
const { getCookie } = require("../helpers/cookie");
const { getAuthJWTToken } = require("../helpers/jwt");
const { isEmail } = require("../helpers/validators");

module.exports.register = async (req, res) => {
  if (!isEmail(req.body.email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email",
    });
  }

  const password = await bcrypt.hash(
    req.body.password,
    config.bcrypt.saltRounds
  );

  const user = await db.User({
    name: req.body.name,
    username: req.body.username,
    password,
    email: req.body.email,
    mobile: req.body.mobile,
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "User with same email or username already exists",
    });
  }

  return res.status(201).json({
    success: true,
    message:
      "Registration Successful, Verification Email has been sent to your registered Email. Kindly Check spam folder also.",
  });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await db.User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .set({ "Set-Cookie": "token=; Path=/;" })
      .json({ success: false, message: "User Not Found" });
  }

  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    return res.status(401).set({ "Set-Cookie": "token=; Path=/;" }).json({
      success: false,
      message: "Incorrect Credentials",
    });
  }

  const APIToken = getAuthJWTToken(user);
  return res
    .status(201)
    .set({ "Set-Cookie": getCookie(APIToken) })
    .json({
      success: true,
      message: "Login Successful",
    });
};

module.exports.logout = async (req, res) => {
  return res.status(200).set({ "Set-Cookie": "token=; Path=/;" }).json({
    success: true,
    message: "Successfully logged out",
  });
};
