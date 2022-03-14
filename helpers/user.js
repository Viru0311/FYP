const cookie = require("cookie");
const { getUserFromAuthJWTToken } = require("./jwt");

/**
 * Fetches the user from the JWT Token stored as a
 * cookie
 * @param {express.Request} req
 */
module.exports.getUserFromRequest = async (req) => {
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    if (cookies && cookies.token) {
      const user = await getUserFromAuthJWTToken(cookies.token);
      return user;
    }
  }

  throw new Error("Authorization token not found in cookie");
};
