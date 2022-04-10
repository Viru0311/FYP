const db = require("../models");

module.exports.getConnectList = async (req, res) => {
  try {
    const aggCursor = db.User.aggregate([
      {
        $match: { userType: "doctor" },
      },
      { $project: { name: 1, _id: 1 } },
    ]);

    const data = [];
    for await (const doc of aggCursor) {
      data.push(doc);
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: "Not logged In",
    });
  }
};
