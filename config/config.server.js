const assert = require("assert");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../", ".env") });

const config = {
  // JWT Options
  // TODO: Use RS256 (need to add private/public to specify keys)
  jwt: {
    auth: {
      secret: process.env.JWT_AUTH_SECRET,
      options: {
        expiresIn: "7d",
      },
    },
    // Token used for email verification, forget password
    // This is accessible publicly sent via email
    public: {
      secret: process.env.JWT_PUBLIC_SECRET,
      options: {
        expiresIn: "24h",
      },
    },
  },

  // Cookie
  cookie: {
    // 7 Days (in seconds)
    expireTime: 7 * 24 * 60 * 60,
  },

  bcrypt: {
    saltRounds: 6,
  },
};

module.exports = config;
