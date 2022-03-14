// Confirm whether a string is an email
module.exports.isEmail = (email) => {
  const emailPattern = new RegExp(
    "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}"
  );
  return emailPattern.test(email);
};
