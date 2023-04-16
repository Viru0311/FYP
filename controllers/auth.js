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
  if (req.body.userType === 'pharmacist') {
    const checkPharmacy = await db.User.findOne({
      userType: "pharmacist"
    })
    if (checkPharmacy) {
      return res.status(400).json({
        success: false,
        message: "Already a pharmacist exists",
      });
    }
  }
  const user = await db.User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    mobile: req.body.mobile,
    password: password,
    gender: req.body.gender,
    userType: req.body.userType,
  });

  try {
    await user.save();
  } catch (err) {
    // console.log(err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  console.log("Success");

  return res.status(201).json({
    success: true,
    message: "Registration Successful",
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
      user: { ...user._doc, password: null },
    });
};

module.exports.logout = async (req, res) => {
  return res.status(200).set({ "Set-Cookie": "token=; Path=/;" }).json({
    success: true,
    message: "Successfully logged out",
  });
};
