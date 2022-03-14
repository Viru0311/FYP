const jwt = require("jsonwebtoken");
const config = require("../config/config.server");

const db = require("../models");

function getAuthJWTToken(user) {
  return jwt.sign(
    { id: user._id.toString() },
    config.jwt.auth.secret,
    config.jwt.auth.options
  );
}

/**
 * Synchronously sign the given category and user into a
 * JSON Web Token string
 * @param {db.User} user - Mongoose User instance
 * @param {String} category - String representing the goal of the public token
 *  For Example, set-password and activate routes should have different tokens hence
 *  they will have separate category respectively.
 */
function getPublicJWTToken(user, category) {
  return jwt.sign(
    {
      id: user._id.toString(),
      category,
    },
    config.jwt.public.secret,
    config.jwt.public.options
  );
}

async function getUserFromDecodedToken(token) {
  const invalidTokenError = new Error("Invalid Token");

  if (!token) {
    throw invalidTokenError;
  }

  const user = await db.User.findById(token.id);

  if (!user) {
    throw invalidTokenError;
  }

  return user;
}

async function getUserFromPublicJWTToken(token) {
  const decodedToken = jwt.verify(
    token,
    config.jwt.public.secret,
    config.jwt.public.options
  );
  const user = await getUserFromDecodedToken(decodedToken);
  return user;
}

async function getUserFromAuthJWTToken(token) {
  const decodedToken = jwt.verify(
    token,
    config.jwt.auth.secret,
    config.jwt.auth.options
  );
  const user = await getUserFromDecodedToken(decodedToken);
  return user;
}

module.exports = {
  getAuthJWTToken,
  getPublicJWTToken,
  getUserFromAuthJWTToken,
  getUserFromPublicJWTToken,
};
