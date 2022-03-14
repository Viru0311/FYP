const config = require("../config/config.server");

function getCookie(authJWTToken) {
  let cookie = `token=${authJWTToken}; Max-Age=${config.cookie.expireTime}; Path=/; HttpOnly;`;
  return cookie;
}

module.exports.getCookie = getCookie;
