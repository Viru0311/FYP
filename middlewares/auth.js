const { getUserFromRequest } = require("../helpers/user");

module.exports.validateJWTToken = async (req, res, next) => {
  try {
    const user = await getUserFromRequest(req);
    req.user = user;
    next();
    return;
  } catch (err) {
    return res.status(401).set({ "Set-Cookie": "token=; Path=/;" }).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.validateUserIsOfPatientType = async (req, res, next) => {
  try {
    if (req.user.userType !== "patient") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    next();
    return;
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.validateUserIsOfDoctorType = async (req, res, next) => {
  try {
    if (req.user.userType !== "doctor") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    next();
    return;
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};
