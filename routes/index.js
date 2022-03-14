const express = require("express");

const auth = require("../controllers/auth");
const patient = require("../controllers/patient");
const { wrapAsync } = require("../helpers/error");
let {
  validateJWTToken,
  validateUserEmailIsVerified,
  validateUserIsOfPatientType,
} = require("../middlewares/auth");

validateJWTToken = wrapAsync(validateJWTToken);
validateUserEmailIsVerified = wrapAsync(validateUserEmailIsVerified);
const router = express.Router();

// Authentication Routes
router.post("/auth/login", wrapAsync(auth.login));
router.post("/auth/register", wrapAsync(auth.register));
router.get("/auth/logout", validateJWTToken, wrapAsync(auth.logout));

// patient Routes
router.post(
  "/patient/getPreliminaryResult",
  validateJWTToken,
  validateUserIsOfPatientType,
  patient.getPreliminaryResult
);

router.get(
  "/patient/getAllResults",
  validateJWTToken,
  validateUserIsOfPatientType,
  patient.getAllResults
);

router.get("/test", validateJWTToken, (req, res) => {
  res.send("Yo Bitch");
});

module.exports = router;
