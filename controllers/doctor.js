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

module.exports.passFinalVerdict = async (req, res) => {
  try {
    const { patientId, resultId, consult, doctorVerdict } = req.body;

    await db.User.updateOne(
      { "patientResults._id": resultId },
      {
        $set: {
          "patientResults.$.doctorDiagnosis": {
            output: doctorVerdict,
            comment: consult,
          },
        },
      }
    );

    for (let i = 0; i < req.user.requestedConsultation.length; i++) {
      if (req.user.requestedConsultation[i].resultId === resultId) {
        req.user.requestedConsultation[i].verified = true;
      }
    }

    req.user.save();

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    // console.log(err);
    return res.status(200).json({
      success: false,
      message: "Not logged In",
    });
  }
};
